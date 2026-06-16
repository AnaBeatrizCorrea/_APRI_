function fazerLogin(event) {
    event.preventDefault();

    const usuario = document.getElementById('texto').value;
    const senha = document.getElementById('password').value;

    if (usuario === 'administrador' && senha === '1234') {
        window.location.href = 'area_adm.html';
    }else if(usuario === 'associado' && senha === '1234') {
        window.location.href = 'area_associado.html';
    } else {
        alert('Usuário ou senha incorretos!');
    }

    return false;
}
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    btn.classList.add('active');
}


function toggleAssociado(btn) {
    const card     = btn.closest('.associado-card');
    const detalhes = card.nextElementSibling;
    const icon     = btn.querySelector('i');
    const aberto   = detalhes.style.display === 'block';
    detalhes.style.display = aberto ? 'none' : 'block';
    icon.className = aberto ? 'bi bi-chevron-down' : 'bi bi-chevron-up';
}


let _todosAssociados = null;

function filtrarAssociados() {
    const lista  = document.getElementById('lista-associados');

    if (!_todosAssociados) {
        _todosAssociados = [];
        const filhos = Array.from(lista.children);
        for (let i = 0; i < filhos.length; i += 2) {
            _todosAssociados.push({ card: filhos[i], detalhe: filhos[i + 1] });
        }
    }

    const busca  = document.getElementById('busca-associado').value.toLowerCase();
    const status = document.getElementById('filtro-status').value;
    const ordem  = document.getElementById('ordenar').value;

    let visiveis = _todosAssociados.filter(({ card }) => {
        const nomeOk = card.dataset.nome.toLowerCase().includes(busca);
        const stOk   = status === '' || card.dataset.status === status;
        return nomeOk && stOk;
    });


    visiveis.sort((a, b) => {
        const na = a.card.dataset.nome;
        const nb = b.card.dataset.nome;
        return ordem === 'az' ? na.localeCompare(nb) : nb.localeCompare(na);
    });

    
    lista.innerHTML = '';
    _todosAssociados.forEach(({ card, detalhe }) => {
        const visivel = visiveis.includes({ card, detalhe }) ||
                        visiveis.some(v => v.card === card);
        card.style.display   = visivel ? '' : 'none';
        detalhe.style.display = 'none'; 
        lista.appendChild(card);
        lista.appendChild(detalhe);
    });
}



function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = '';

    const form = document.querySelector(`#${id} form`);
    if (form) form.reset();
  
    const preview = document.querySelector(`#${id} .upload-preview`);
    const uploadArea = document.querySelector(`#${id} .upload-area`);
    if (preview && uploadArea) {
        preview.style.display = 'none';
        uploadArea.querySelector('.upload-placeholder').style.display = 'flex';
    }
}


document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        fecharModal(e.target.id);
    }
});


document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => {
            if (m.style.display === 'flex') fecharModal(m.id);
        });
    }
});


function setupUpload(inputId, areaId) {
    const input = document.getElementById(inputId);
    const area  = document.getElementById(areaId);
    if (!input || !area) return;

    const placeholder = area.querySelector('.upload-placeholder');
    const preview     = area.querySelector('.upload-preview');

    area.addEventListener('click', () => input.click());

    area.addEventListener('dragover', e => {
        e.preventDefault();
        area.classList.add('drag-over');
    });
    area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
    area.addEventListener('drop', e => {
        e.preventDefault();
        area.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) mostrarPreview(e.dataTransfer.files[0], placeholder, preview);
    });

    input.addEventListener('change', () => {
        if (input.files[0]) mostrarPreview(input.files[0], placeholder, preview);
    });
}

function mostrarPreview(file, placeholder, preview) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
        preview.src = e.target.result;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
}


document.addEventListener('DOMContentLoaded', () => {
    const mapa = {
        'btn-add-conteudo':  'modal-conteudo',
        'btn-add-curso':     'modal-curso',
        'btn-add-projeto':   'modal-projeto',
    };

    document.querySelectorAll('.btn-add').forEach(btn => {
        const panel = btn.closest('.tab-panel');
        if (!panel) return;
        const tabId = panel.id; 

        if (tabId === 'tab-conteudos') btn.id = 'btn-add-conteudo';
        else if (tabId === 'tab-cursos')    btn.id = 'btn-add-curso';
        else if (tabId === 'tab-projetos')  btn.id = 'btn-add-projeto';

        btn.addEventListener('click', () => {
            const modalId = mapa[btn.id];
            if (modalId) abrirModal(modalId);
        });
    });

    setupUpload('upload-conteudo-input', 'upload-conteudo-area');
    setupUpload('upload-curso-input',    'upload-curso-area');
    setupUpload('upload-projeto-input',  'upload-projeto-area');

    const tipoProj = document.getElementById('proj-tipo');
    if (tipoProj) {
        tipoProj.addEventListener('change', () => {
            const financeiro = document.getElementById('proj-campos-financeiros');
            financeiro.style.display =
                tipoProj.value === 'educacional' ? 'grid' : 'none';
        });
    }
});