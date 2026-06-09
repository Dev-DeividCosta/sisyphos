/**
 * CONFIGURAÇÃO DOS BOTÕES
 * Adicione a propriedade "icone" com o código <svg> desejado. 
 * Se você não passar um ícone, ele herdará o ícone padrão do botão clonado.
 */
const CONFIG_BOTOES = [
    {
        id: 'meu-botao-customizado-1',
        texto: 'Link Principal',
        url: 'https://link1.com.br',
        target: '_blank',
        // Ícone de uma Estrela (exemplo)
        icone: '<svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
    },
    {
        id: 'meu-botao-customizado-2',
        texto: 'Segunda Opção',
        url: 'https://link2.com.br',
        target: '_self',
        // Ícone de Engrenagem / Configurações (exemplo)
        icone: '<svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>'
    },
    {
        id: 'meu-botao-customizado-3',
        texto: 'Painel Admin',
        url: 'https://link3.com.br',
        target: '_blank',
        // Sem a propriedade "icone", ele manterá o ícone original do botão que foi clonado
    }
];

/**
 * GERENCIADOR DE INJEÇÃO
 * Orquestra o mapeamento da lista e garante que a injeção ocorra em lote.
 */
function gerenciarInjecaoBotoes() {
    const menuList = document.querySelector('ul.menu__list');
    if (!menuList) return;

    // Busca os itens nativos para usar como molde visual (clonagem)
    const itensNativos = Array.from(menuList.querySelectorAll('li.menu__item'));
    const itemReferencia = itensNativos.find(el => !el.querySelector('.menu-button--actived')) || itensNativos[0];
    if (!itemReferencia) return;

    // Itera sobre a configuração e injeta apenas os botões que ainda não existem no DOM
    CONFIG_BOTOES.forEach(config => {
        if (document.getElementById(config.id)) return;
        injetarBotao(menuList, itemReferencia, config);
    });
}

/**
 * FÁBRICA ATÔMICA DE BOTÕES
 * Responsável por clonar, parametrizar e inserir um único botão por vez.
 */
function injetarBotao(menuList, itemReferencia, config) {
    // Clona a estrutura nativa para herdar o comportamento visual do sistema
    const novoBotao = itemReferencia.cloneNode(true);
    novoBotao.id = config.id;
    novoBotao.style.width = '100%';
    novoBotao.style.display = 'block';

    // Trata e limpa o elemento de link interno
    const link = novoBotao.querySelector('a');
    if (link) {
        link.href = config.url;
        link.target = config.target || '_blank';
        link.classList.remove('router-link-active', 'router-link-exact-active');
    }

    // Remove estados de seleção/ativo herdados do botão copiado
    const btnInterno = novoBotao.querySelector('.menu-button');
    if (btnInterno) btnInterno.classList.remove('menu-button--actived');

    // Gerencia o Ícone
    const iconeContainer = novoBotao.querySelector('.menu-button__icon');
    if (iconeContainer) {
        iconeContainer.classList.remove('menu-button__icon--active');
        
        // Se a configuração tiver um SVG customizado, injeta no container
        if (config.icone) {
            iconeContainer.innerHTML = config.icone;
            
            // Garante que o novo SVG herde as classes necessárias para se comportar como o nativo
            const svgElement = iconeContainer.querySelector('svg');
            if (svgElement) {
                svgElement.classList.add('icon-svg', 'menu-button__icon');
            }
        }
    }

    // Injeta o texto customizado e resolve o problema de quebra de linha via CSS
    const textSpan = novoBotao.querySelector('.menu-button__text span');
    if (textSpan) {
        textSpan.textContent = config.texto;
        textSpan.style.whiteSpace = 'nowrap';
    }

    // Insere no DOM e inicia o MutationObserver de sincronização individual
    menuList.appendChild(novoBotao);
    sincronizarEstadoSidebar(itemReferencia, novoBotao);
}

/**
 * SINCRONIZADOR DE SINAL
 * Acopla um observador em cada botão criado para espelhar o estado colapsado/expandido da sidebar.
 */
function sincronizarEstadoSidebar(itemNativo, itemCustomizado) {
    const btnNativo = itemNativo.querySelector('.menu-button');
    const btnCustomizado = itemCustomizado.querySelector('.menu-button');
    if (!btnNativo || !btnCustomizado) return;

    const sincronizar = () => {
        const estaColapsado = btnNativo.classList.contains('menu-button--collapsed');
        btnCustomizado.classList.toggle('menu-button--collapsed', estaColapsado);
    };

    sincronizar();

    new MutationObserver(sincronizar).observe(btnNativo, { 
        attributes: true, 
        attributeFilter: ['class'] 
    });
}

/**
 * OBSERVADOR GLOBAL DO DOM
 * Garante a persistência dos botões customizados caso o SPA re-renderize o menu.
 */
const observer = new MutationObserver(() => {
    const menuListExistente = document.querySelector('ul.menu__list');
    if (!menuListExistente) return;

    // Validação eficiente: Só dispara a injeção se detectar que algum botão da lista sumiu do mapa
    const algumBotaoFaltando = CONFIG_BOTOES.some(config => !document.getElementById(config.id));
    if (algumBotaoFaltando) {
        gerenciarInjecaoBotoes();
    }
});

// Inicialização do ecossistema
observer.observe(document.body, { childList: true, subtree: true });
gerenciarInjecaoBotoes();