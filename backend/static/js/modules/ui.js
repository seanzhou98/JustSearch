import { md, createCopyButton } from './utils.js';

export const elements = {
    chatContainer: null,
    historyList: null,
    heroSection: null,
    userInput: null,
    sendBtn: null,
    newChatBtn: null,
    settingsModal: null,
    sidebar: null,
    expandSidebarBtn: null,
    collapseSidebarBtn: null,
    closeSidebarBtn: null,
    mobileOverlay: null,
    scrollToBottomBtn: null
};

export function initUI() {
    elements.chatContainer = document.getElementById('chat-container');
    elements.historyList = document.getElementById('history-list');
    elements.heroSection = document.getElementById('hero-section');
    elements.userInput = document.getElementById('user-input');
    elements.sendBtn = document.getElementById('send-btn');
    elements.newChatBtn = document.getElementById('new-chat-btn');
    elements.settingsModal = document.getElementById('settings-modal');
    elements.sidebar = document.getElementById('sidebar');
    elements.expandSidebarBtn = document.getElementById('expand-sidebar-btn');
    elements.collapseSidebarBtn = document.getElementById('collapse-sidebar-btn');
    elements.closeSidebarBtn = document.getElementById('close-sidebar-btn');
    elements.mobileOverlay = document.getElementById('mobile-overlay');
    elements.scrollToBottomBtn = document.getElementById('scroll-to-bottom-btn');

    initScrollBehavior();
}

function initScrollBehavior() {
    const { chatContainer, scrollToBottomBtn } = elements;

    chatContainer.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = chatContainer;
        const scrollBottom = scrollHeight - scrollTop - clientHeight;
        
        // Show button if we are scrolled up more than 100px
        if (scrollBottom > 100) {
            scrollToBottomBtn.classList.add('visible');
        } else {
            scrollToBottomBtn.classList.remove('visible');
        }
    });

    scrollToBottomBtn.addEventListener('click', () => {
        scrollToBottom();
    });
}

export function renderHistory(history, currentSessionId, callbacks) {
    const { onSelect, onDelete } = callbacks;
    elements.historyList.innerHTML = '';
    
    history.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'history-item';
        if (chat.id === currentSessionId) item.classList.add('active');
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'history-title';
        titleSpan.textContent = chat.title || '新对话';
        item.appendChild(titleSpan);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-history-btn';
        deleteBtn.title = '删除对话';
        deleteBtn.innerHTML = '<span class="material-symbols-rounded">delete</span>';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            onDelete(chat.id);
        };
        item.appendChild(deleteBtn);

        item.dataset.id = chat.id;
        item.onclick = () => onSelect(chat.id);
        elements.historyList.appendChild(item);
    });
}

export function updateActiveHistoryItem(sessionId) {
    document.querySelectorAll('.history-item').forEach(item => {
        if (item.dataset.id === sessionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

export function renderMessages(messages) {
    elements.chatContainer.innerHTML = '';
    if (!messages || messages.length === 0) {
        elements.chatContainer.appendChild(elements.heroSection);
        elements.heroSection.style.display = 'block';
        return;
    }
    
    elements.heroSection.style.display = 'none';
    
    messages.forEach(msg => {
        appendMessage(msg.role, msg.content, msg.logs);
    });
    
    scrollToBottom();
}

export function appendMessage(role, content, logs = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    
    if (role === 'assistant' && logs && logs.length > 0) {
         msgDiv.appendChild(createLogContainer(logs));
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (role === 'assistant') {
        contentDiv.classList.add('markdown-body');
        const sources = extractSources(content);
        contentDiv.innerHTML = renderWithCitations(content, sources);
    } else {
        contentDiv.textContent = content;
    }
    
    // Add Copy Button
    const copyBtn = createCopyButton(content);
    contentDiv.appendChild(copyBtn);
    
    msgDiv.appendChild(contentDiv);
    elements.chatContainer.appendChild(msgDiv);
    return { msgDiv, contentDiv };
}

export function scrollToBottom() {
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
}

export function createLogContainer(logs) {
    const logContainer = document.createElement('div');
    logContainer.className = 'log-container';
    
    const logSummary = document.createElement('div');
    logSummary.className = 'log-summary';
    
    const statusLeft = document.createElement('div');
    statusLeft.className = 'log-status-left';
    
    const spinner = document.createElement('span');
    spinner.className = 'material-symbols-rounded log-spinner';
    // If we are creating from history, it's done
    spinner.textContent = 'check_circle'; 
    
    const statusText = document.createElement('span');
    statusText.className = 'log-status-text';
    statusText.textContent = '思考过程';
    
    statusLeft.appendChild(spinner);
    statusLeft.appendChild(statusText);
    
    const expandIcon = document.createElement('span');
    expandIcon.className = 'material-symbols-rounded expand-icon';
    expandIcon.textContent = 'expand_more';
    
    logSummary.appendChild(statusLeft);
    logSummary.appendChild(expandIcon);
    
    const logDetails = document.createElement('div');
    logDetails.className = 'log-details';
    
    if (logs && Array.isArray(logs)) {
        logs.forEach(log => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `<span>${log}</span>`;
            logDetails.appendChild(entry);
        });
    }
    
    logSummary.onclick = () => {
        logDetails.classList.toggle('open');
        const isOpen = logDetails.classList.contains('open');
        expandIcon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    };
    
    logContainer.appendChild(logSummary);
    logContainer.appendChild(logDetails);
    
    return logContainer;
}

// Helper for dynamic log creation during streaming
export function createDynamicLogContainer() {
    const logContainer = document.createElement('div');
    logContainer.className = 'log-container';
    logContainer.style.display = 'none'; // Hidden initially
    
    const logSummary = document.createElement('div');
    logSummary.className = 'log-summary';
    
    const statusLeft = document.createElement('div');
    statusLeft.className = 'log-status-left';
    
    const spinner = document.createElement('span');
    spinner.className = 'material-symbols-rounded log-spinner rotating';
    spinner.textContent = 'progress_activity';
    
    const statusText = document.createElement('span');
    statusText.className = 'log-status-text';
    statusText.textContent = '正在思考...';
    
    statusLeft.appendChild(spinner);
    statusLeft.appendChild(statusText);
    
    const expandIcon = document.createElement('span');
    expandIcon.className = 'material-symbols-rounded expand-icon';
    expandIcon.textContent = 'expand_more';
    
    logSummary.appendChild(statusLeft);
    logSummary.appendChild(expandIcon);
    
    const logDetails = document.createElement('div');
    logDetails.className = 'log-details';
    
    logSummary.onclick = () => {
        logDetails.classList.toggle('open');
        const isOpen = logDetails.classList.contains('open');
        expandIcon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    };
    
    logContainer.appendChild(logSummary);
    logContainer.appendChild(logDetails);
    
    return { logContainer, logDetails, spinner, statusText };
}

export function extractSources(text) {
    const sources = [];
    const regex = /\[(\d+)\] \[.*?\]\((.*?)\)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        sources.push({ id: match[1], url: match[2] });
    }
    return sources;
}

export function renderWithCitations(text, sources) {
    const html = md.render(text);
    if (!sources || sources.length === 0) return html;
    
    const div = document.createElement('div');
    div.innerHTML = html;
    
    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            let parent = node.parentNode;
            while (parent && parent !== div) {
                if (parent.tagName === 'CODE' || parent.tagName === 'PRE' || parent.tagName === 'A') {
                    return NodeFilter.FILTER_REJECT;
                }
                parent = parent.parentNode;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });
    
    const nodesToReplace = [];
    while(walker.nextNode()) {
        const node = walker.currentNode;
        if (/\[\d+\]/.test(node.textContent)) {
            nodesToReplace.push(node);
        }
    }
    
    nodesToReplace.forEach(node => {
        const content = node.textContent;
        const fragment = document.createElement('span');
        
        const parts = content.split(/(\[\d+\])/);
        parts.forEach(part => {
            const match = /^\[(\d+)\]$/.exec(part);
            if (match) {
                const id = match[1];
                const source = sources.find(s => s.id == id);
                if (source) {
                    const a = document.createElement('a');
                    a.href = source.url;
                    a.target = '_blank';
                    a.className = 'citation-link';
                    a.textContent = `[${id}]`;
                    a.style.color = '#0066cc';
                    a.style.textDecoration = 'none';
                    a.style.cursor = 'pointer';
                    fragment.appendChild(a);
                } else {
                    fragment.appendChild(document.createTextNode(part));
                }
            } else {
                fragment.appendChild(document.createTextNode(part));
            }
        });
        
        node.parentNode.replaceChild(fragment, node);
    });
    
    return div.innerHTML;
}