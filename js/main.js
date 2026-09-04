document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // MODO ESCURO
    // ==========================================================================
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            try {
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('dark-mode', 'enabled');
                } else {
                    localStorage.setItem('dark-mode', 'disabled');
                }
            } catch (e) {
                console.warn('localStorage não pôde ser gravado:', e);
            }
        });

        try {
            if (localStorage.getItem('dark-mode') === 'enabled') {
                document.body.classList.add('dark-mode');
            }
        } catch (e) {
            console.warn('localStorage não pôde ser lido:', e);
        }
    }

    // ==========================================================================
    // CONTROLE DE ETAPAS (WIZARD 1 a 4)
    // ==========================================================================
    let currentStep = 3; // Inicia na Etapa 3 conforme design do Figma

    function updateStepVisibility() {
        document.querySelectorAll('.step-content').forEach(el => {
            el.style.display = 'none';
        });

        const activeContent = document.getElementById(`step-content-${currentStep}`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }

        const stepBtns = document.querySelectorAll('.step-progress-btn');
        stepBtns.forEach(btn => {
            const stepNum = parseInt(btn.getAttribute('step-num'), 10);
            btn.removeAttribute('active');
            btn.removeAttribute('checked');
            btn.removeAttribute('aria-current');

            if (stepNum < currentStep) {
                btn.setAttribute('checked', '');
            } else if (stepNum === currentStep) {
                btn.setAttribute('active', '');
                btn.setAttribute('aria-current', 'step');
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Navegação via botões do Stepper
    document.querySelectorAll('.step-progress-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const stepNum = parseInt(btn.getAttribute('step-num'), 10);
            if (stepNum) {
                currentStep = stepNum;
                updateStepVisibility();
            }
        });
    });

    // Botões de Avançar / Voltar das Etapas
    const btnAvancarStep1 = document.getElementById('btn-avancar-step1');
    if (btnAvancarStep1) {
        btnAvancarStep1.addEventListener('click', () => {
            currentStep = 2;
            updateStepVisibility();
        });
    }

    const btnVoltarStep2 = document.getElementById('btn-voltar-step2');
    if (btnVoltarStep2) {
        btnVoltarStep2.addEventListener('click', () => {
            currentStep = 1;
            updateStepVisibility();
        });
    }

    const btnAvancarStep2 = document.getElementById('btn-avancar-step2');
    if (btnAvancarStep2) {
        btnAvancarStep2.addEventListener('click', () => {
            currentStep = 3;
            updateStepVisibility();
        });
    }

    const btnVoltarStep3 = document.getElementById('btn-voltar-step3');
    if (btnVoltarStep3) {
        btnVoltarStep3.addEventListener('click', () => {
            currentStep = 2;
            updateStepVisibility();
        });
    }

    const btnAvancarStep3 = document.getElementById('btn-avancar-step3');
    if (btnAvancarStep3) {
        btnAvancarStep3.addEventListener('click', () => {
            currentStep = 4;
            updateStepVisibility();
        });
    }

    const btnVoltarStep4 = document.getElementById('btn-voltar-step4');
    if (btnVoltarStep4) {
        btnVoltarStep4.addEventListener('click', () => {
            currentStep = 3;
            updateStepVisibility();
        });
    }

    // ==========================================================================
    // ETAPA 1: DADOS DA REUNIÃO & PARTICIPANTES
    // ==========================================================================
    let participantes = [
        { nome: "Enéas Júnior", funcao: "UX Designer" }
    ];
    let participanteParaExcluirIndex = null;

    const partNomeInput = document.getElementById('part-nome');
    const partFuncaoInput = document.getElementById('part-funcao');
    const btnAddPart = document.getElementById('btn-add-participante');
    const warningNenhumPart = document.getElementById('warning-nenhum-participante');
    const wrapperTabelaPart = document.getElementById('wrapper-tabela-participantes');
    const listaPartBody = document.getElementById('lista-participantes-body');
    const txtProcessoEscolha = document.getElementById('txt-processo-escolha');
    const charCounter = document.getElementById('char-counter');
    const modalConfirmacaoExclusao = document.getElementById('modal-confirmacao-exclusao');
    const btnCancelarExclusao = document.getElementById('btn-cancelar-exclusao');
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');

    if (txtProcessoEscolha && charCounter) {
        txtProcessoEscolha.addEventListener('input', () => {
            const remaining = 3000 - txtProcessoEscolha.value.length;
            charCounter.textContent = `Total de caracteres restantes: ${remaining}`;
        });
    }

    function renderParticipantes() {
        if (!listaPartBody) return;
        listaPartBody.innerHTML = '';

        if (participantes.length === 0) {
            if (warningNenhumPart) warningNenhumPart.style.display = 'inline-flex';
            if (wrapperTabelaPart) wrapperTabelaPart.style.display = 'none';
        } else {
            if (warningNenhumPart) warningNenhumPart.style.display = 'none';
            if (wrapperTabelaPart) wrapperTabelaPart.style.display = 'block';

            participantes.forEach((p, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${p.nome}</td>
                    <td>${p.funcao}</td>
                    <td class="text-right">
                        <button type="button" class="btn-excluir-part" data-index="${index}" title="Excluir">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                tr.querySelector('.btn-excluir-part').addEventListener('click', () => {
                    participanteParaExcluirIndex = index;
                    if (modalConfirmacaoExclusao) modalConfirmacaoExclusao.style.display = 'flex';
                });
                listaPartBody.appendChild(tr);
            });
        }
    }

    if (btnAddPart) {
        btnAddPart.addEventListener('click', () => {
            const nome = partNomeInput.value.trim();
            const funcao = partFuncaoInput.value.trim();
            if (nome && funcao) {
                participantes.push({ nome, funcao });
                partNomeInput.value = '';
                partFuncaoInput.value = '';
                renderParticipantes();
            } else {
                alert('Por favor, preencha o Nome e a Função para adicionar.');
            }
        });
    }

    if (btnCancelarExclusao) {
        btnCancelarExclusao.addEventListener('click', () => {
            if (modalConfirmacaoExclusao) modalConfirmacaoExclusao.style.display = 'none';
            participanteParaExcluirIndex = null;
        });
    }

    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', () => {
            if (participanteParaExcluirIndex !== null) {
                participantes.splice(participanteParaExcluirIndex, 1);
                renderParticipantes();
            }
            if (modalConfirmacaoExclusao) modalConfirmacaoExclusao.style.display = 'none';
            participanteParaExcluirIndex = null;
        });
    }

    const inputCpfResponsavel = document.getElementById('input-cpf-responsavel');
    if (inputCpfResponsavel) {
        inputCpfResponsavel.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.substring(0, 11);
            if (v.length > 9) {
                e.target.value = `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6, 9)}-${v.substring(9)}`;
            } else if (v.length > 6) {
                e.target.value = `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6)}`;
            } else if (v.length > 3) {
                e.target.value = `${v.substring(0, 3)}.${v.substring(3)}`;
            } else {
                e.target.value = v;
            }
        });
    }

    const btnLimparStep1 = document.getElementById('btn-limpar-dados-step1');
    if (btnLimparStep1) {
        btnLimparStep1.addEventListener('click', () => {
            const inputs = ['input-diretor', 'input-cpf-responsavel', 'input-data-reuniao', 'input-hora-inicio', 'input-hora-termino'];
            inputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            if (partNomeInput) partNomeInput.value = '';
            if (partFuncaoInput) partFuncaoInput.value = '';
            if (txtProcessoEscolha) {
                txtProcessoEscolha.value = '';
                if (charCounter) charCounter.textContent = 'Total de caracteres restantes: 3000';
            }
            participantes = [];
            renderParticipantes();
        });
    }

    // ==========================================================================
    // ETAPA 2: MATRIZES DE AVALIAÇÃO
    // ==========================================================================
    const step2Ratings = {
        caracteristicas: { 1: 4, 2: 2, 3: 2, 4: 2, 5: 4, 6: 2, 7: 2, 8: 2, 9: 4, 10: 2, 11: 4, 12: 4, 13: 3, 14: 3 },
        pedagogicos: { 1: 4, 2: 3, 3: 4, 4: 4, 5: 5, 6: 4, 7: 3 }
    };

    function updateRatingsUI() {
        document.querySelectorAll('.matriz-item-ratings').forEach(container => {
            const group = container.getAttribute('data-group');
            const index = container.getAttribute('data-index');
            const selectedVal = step2Ratings[group][index];

            container.querySelectorAll('.rating-btn').forEach(btn => {
                const val = parseInt(btn.getAttribute('data-value'), 10);
                if (val === selectedVal) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    }

    document.querySelectorAll('.rating-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const container = e.target.closest('.matriz-item-ratings');
            const group = container.getAttribute('data-group');
            const index = container.getAttribute('data-index');
            const value = parseInt(e.target.getAttribute('data-value'), 10);

            if (step2Ratings[group][index] === value) {
                step2Ratings[group][index] = null;
            } else {
                step2Ratings[group][index] = value;
            }
            updateRatingsUI();
        });
    });

    const btnLimparStep2 = document.getElementById('btn-limpar-dados-step2');
    if (btnLimparStep2) {
        btnLimparStep2.addEventListener('click', () => {
            Object.keys(step2Ratings.caracteristicas).forEach(k => step2Ratings.caracteristicas[k] = null);
            Object.keys(step2Ratings.pedagogicos).forEach(k => step2Ratings.pedagogicos[k] = null);
            updateRatingsUI();
        });
    }

    // ==========================================================================
    // ETAPA 3: ESCOLHA DAS OBRAS (FIGMA NODE 91:2641)
    // ==========================================================================

    // Estado das Categorias
    const step3State = {
        cat1: {
            limit: 5,
            notDesired: false,
            acervos: {
                'creche-1': 1,
                'creche-2': 1,
                'creche-3': 0,
                'creche-4': 1,
                'creche-5': 2,
                'creche-6': 0,
                'creche-7': 0,
                'creche-8': 0
            }
        },
        cat2: {
            limit: 5,
            notDesired: false,
            acervos: {
                'pre-1': 2,
                'pre-2': 0,
                'pre-3': 0,
                'pre-4': 2,
                'pre-5': 0,
                'pre-6': 2,
                'pre-7': 0
            }
        },
        cat3: {
            limit: 5,
            notDesired: false,
            selected: new Set(['AP001', 'AP003', 'AP007', 'AP009', 'AP011']),
            currentPage: 1,
            itemsPerPage: 16,
            totalItems: 640,
            filters: {
                titulo: '',
                tema: '',
                codigo: '',
                autores: '',
                editora: ''
            }
        }
    };

    // Gerador de Obras da Categoria 3 (640 obras mockadas para 40 páginas de 16)
    const autoresMock = ["Ana Ribeiro", "Carlos Drummond", "Clarice Lispector", "Monteiro Lobato", "Ruth Rocha", "Ziraldo Alves", "Cecília Meireles", "Vinicius de Moraes", "Marina Colasanti", "Lygia Bojunga", "Eva Furnari", "Pedro Bandeira"];
    const temasMock = ["Alfabetização", "Literatura Infantil", "Ciências e Descoberta", "Meio Ambiente", "Matemática Lúdica", "Artes e Cores", "História e Memória", "Diversidade Cultural", "Contos e Fábulas", "Linguagem e Expressão"];
    const editorasMock = ["Editora Educação e Saber", "Editora Futuro", "Editora Nova Letra", "Editora Letras Vivas", "Editora Aprender Mais", "Editora Brasil Didático", "Editora Horizonte", "Editora Estrela"];

    const todasObrasCat3 = [];
    for (let i = 1; i <= 640; i++) {
        const codNum = String(i).padStart(3, '0');
        const autor1 = autoresMock[(i - 1) % autoresMock.length];
        const autor2 = autoresMock[i % autoresMock.length];
        const tema = temasMock[(i - 1) % temasMock.length];
        const editora = editorasMock[(i - 1) % editorasMock.length];

        todasObrasCat3.push({
            id: `AP${codNum}`,
            codigo: `AP${codNum}`,
            titulo: `Obra ${i}: ${tema}`,
            autores: `${autor1}; ${autor2}`,
            tema: tema,
            editora: editora
        });
    }

    // Atualização dos Contadores de Cada Categoria
    function updateCategoryCounters(catKey) {
        const cat = step3State[catKey];
        const limiteEl = document.getElementById(`limite-${catKey}`);
        const selecionadoEl = document.getElementById(`selecionado-${catKey}`);
        const restanteEl = document.getElementById(`restante-${catKey}`);

        let totalSelected = 0;
        if (!cat.notDesired) {
            if (catKey === 'cat3') {
                totalSelected = cat.selected.size;
            } else {
                totalSelected = Object.values(cat.acervos).reduce((acc, curr) => acc + curr, 0);
            }
        }

        const remaining = Math.max(0, cat.limit - totalSelected);

        if (limiteEl) limiteEl.textContent = cat.limit;

        if (selecionadoEl) {
            selecionadoEl.textContent = totalSelected;
            if (totalSelected > 0) {
                selecionadoEl.classList.add('selecionado-verde');
            } else {
                selecionadoEl.classList.remove('selecionado-verde');
            }
        }

        if (restanteEl) {
            restanteEl.textContent = remaining;
            if (remaining === 0) {
                restanteEl.classList.add('restante-esgotado');
            } else {
                restanteEl.classList.remove('restante-esgotado');
            }
        }
    }

    // Atualização da UI dos Cards de Acervo (Cat 1 e Cat 2)
    function updateAcervoCardsUI(catKey) {
        const cat = step3State[catKey];
        const grid = document.getElementById(`grid-${catKey}`);
        if (!grid) return;

        const totalSelected = Object.values(cat.acervos).reduce((acc, curr) => acc + curr, 0);
        const limitReached = totalSelected >= cat.limit;

        grid.querySelectorAll('.acervo-card').forEach(card => {
            const id = card.getAttribute('data-id');
            const qty = cat.acervos[id] || 0;
            const numberSpan = card.querySelector('.stepper-number');
            const minusBtn = card.querySelector('.btn-minus');
            const plusBtn = card.querySelector('.btn-plus');
            const badge = card.querySelector('.acervo-badge');

            if (numberSpan) numberSpan.textContent = qty;

            if (cat.notDesired) {
                card.classList.add('is-disabled');
                if (minusBtn) minusBtn.disabled = true;
                if (plusBtn) plusBtn.disabled = true;
                if (badge) badge.style.display = 'none';
            } else {
                card.classList.remove('is-disabled');
                if (minusBtn) minusBtn.disabled = qty === 0;
                if (plusBtn) plusBtn.disabled = limitReached;

                if (qty > 0) {
                    card.classList.add('is-selected');
                    if (badge) {
                        badge.style.display = 'block';
                        badge.className = 'acervo-badge badge-selecionado';
                        badge.textContent = 'Selecionado';
                    }
                } else {
                    card.classList.remove('is-selected');
                    if (badge) {
                        badge.style.display = 'none';
                    }
                }
            }
        });

        updateCategoryCounters(catKey);
    }

    // Configuração dos Botões Stepper de Acervos
    function initAcervoSteppers() {
        ['cat1', 'cat2'].forEach(catKey => {
            const grid = document.getElementById(`grid-${catKey}`);
            if (!grid) return;

            grid.addEventListener('click', (e) => {
                const card = e.target.closest('.acervo-card');
                if (!card) return;

                const id = card.getAttribute('data-id');
                const cat = step3State[catKey];
                if (cat.notDesired) return;

                const currentVal = cat.acervos[id] || 0;
                const totalSelected = Object.values(cat.acervos).reduce((acc, curr) => acc + curr, 0);

                if (e.target.closest('.btn-plus')) {
                    if (totalSelected < cat.limit) {
                        cat.acervos[id] = currentVal + 1;
                        updateAcervoCardsUI(catKey);
                    }
                } else if (e.target.closest('.btn-minus')) {
                    if (currentVal > 0) {
                        cat.acervos[id] = currentVal - 1;
                        updateAcervoCardsUI(catKey);
                    }
                }
            });
        });
    }

    // Configuração dos Switches "Não desejo receber"
    function initSwitches() {
        ['cat1', 'cat2', 'cat3'].forEach(catKey => {
            const switchInput = document.getElementById(`switch-${catKey}`);
            if (!switchInput) return;

            switchInput.addEventListener('change', (e) => {
                step3State[catKey].notDesired = e.target.checked;

                if (catKey === 'cat3') {
                    renderObrasCat3();
                    updateCategoryCounters('cat3');
                } else {
                    updateAcervoCardsUI(catKey);
                }
            });
        });
    }

    // Renderização e Filtro da Categoria 3
    function getFilteredObrasCat3() {
        const { titulo, tema, codigo, autores, editora } = step3State.cat3.filters;

        return todasObrasCat3.filter(obra => {
            const matchTitulo = !titulo || obra.titulo.toLowerCase().includes(titulo.toLowerCase());
            const matchTema = !tema || obra.tema.toLowerCase().includes(tema.toLowerCase());
            const matchCodigo = !codigo || obra.codigo.toLowerCase().includes(codigo.toLowerCase());
            const matchAutores = !autores || obra.autores.toLowerCase().includes(autores.toLowerCase());
            const matchEditora = !editora || obra.editora.toLowerCase().includes(editora.toLowerCase());

            return matchTitulo && matchTema && matchCodigo && matchAutores && matchEditora;
        });
    }

    function renderObrasCat3() {
        const grid = document.getElementById('obras-pedagogicas-grid');
        const prevBtn = document.getElementById('btn-obras-prev');
        const nextBtn = document.getElementById('btn-obras-next');
        const filtrosContainer = document.getElementById('filtros-cat3');
        const carouselWrapper = document.getElementById('obras-carousel-cat3');

        if (!grid) return;

        const cat = step3State.cat3;
        const filteredList = getFilteredObrasCat3();
        const totalItems = filteredList.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / cat.itemsPerPage));

        if (cat.currentPage > totalPages) {
            cat.currentPage = 1;
        }

        const isLimitReached = !cat.notDesired && cat.selected.size >= cat.limit;

        if (cat.notDesired) {
            if (filtrosContainer) filtrosContainer.style.opacity = '0.4';
            if (carouselWrapper) carouselWrapper.style.opacity = '0.4';
            grid.querySelectorAll('.obra-card-item').forEach(card => card.classList.add('is-disabled'));
        } else {
            if (filtrosContainer) filtrosContainer.style.opacity = '1';
            if (carouselWrapper) carouselWrapper.style.opacity = '1';
        }

        // Render Cards da página atual
        const startIndex = (cat.currentPage - 1) * cat.itemsPerPage;
        const pageItems = filteredList.slice(startIndex, startIndex + cat.itemsPerPage);

        grid.innerHTML = '';

        if (pageItems.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 32px; color: #666;">Nenhuma obra encontrada para os filtros informados.</div>';
        } else {
            pageItems.forEach(obra => {
                const isSelected = cat.selected.has(obra.id);
                const isBlocked = isLimitReached && !isSelected;

                const card = document.createElement('div');
                card.className = `obra-card-item ${isSelected ? 'is-selected' : ''} ${isBlocked ? 'is-blocked' : ''} ${cat.notDesired ? 'is-disabled' : ''}`;
                card.setAttribute('data-id', obra.id);
                if (isBlocked) {
                    card.setAttribute('title', 'Limite de 5 obras selecionadas atingido. Desmarque uma obra para selecionar outra.');
                }

                card.innerHTML = `
                    <div class="obra-card-checkbox-custom ${isSelected ? 'is-checked' : ''} ${isBlocked ? 'is-blocked' : ''}">
                        ${isSelected ? `
                            <svg class="check-svg-icon" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3.5 8.5 6.5 11.5 12.5 4.5"></polyline>
                            </svg>
                        ` : isBlocked ? `
                            <svg class="prohibition-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="9.5"></circle>
                                <line x1="5.3" y1="5.3" x2="18.7" y2="18.7"></line>
                            </svg>
                        ` : ''}
                    </div>
                    <div class="obra-card-content">
                        <div class="obra-card-title">${obra.titulo}</div>
                        <div class="obra-card-desc">${obra.codigo} - ${obra.autores}; ${obra.tema}</div>
                    </div>
                `;

                card.addEventListener('click', () => {
                    if (cat.notDesired) return;
                    if (isBlocked) {
                        // Feedback tátil sutil no próprio card/checkbox sem nenhum tipo de popup
                        card.classList.remove('shake-subtle');
                        void card.offsetWidth;
                        card.classList.add('shake-subtle');
                        return;
                    }
                    handleObraSelection(obra.id, !isSelected);
                });

                grid.appendChild(card);
            });
        }

        // Controles de Navegação Anterior / Próxima
        if (prevBtn) prevBtn.disabled = cat.currentPage <= 1 || cat.notDesired;
        if (nextBtn) nextBtn.disabled = cat.currentPage >= totalPages || cat.notDesired;

        // Render Paginação (1 2 3 4 5 6 ... 40)
        renderPaginationButtons(totalPages);
        updateCategoryCounters('cat3');
    }

    function handleObraSelection(obraId, isChecked) {
        const cat = step3State.cat3;
        if (isChecked) {
            if (cat.selected.size >= cat.limit) {
                return;
            }
            cat.selected.add(obraId);
        } else {
            cat.selected.delete(obraId);
        }
        renderObrasCat3();
    }

    function renderPaginationButtons(totalPages) {
        const container = document.getElementById('obras-pagination');
        if (!container) return;
        container.innerHTML = '';

        const cat = step3State.cat3;
        const current = cat.currentPage;

        function createPageBtn(page, isActive = false) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `pagination-page-btn ${isActive ? 'active' : ''}`;
            btn.textContent = page;
            btn.disabled = cat.notDesired;
            btn.addEventListener('click', () => {
                cat.currentPage = page;
                renderObrasCat3();
            });
            return btn;
        }

        function createEllipsis() {
            const span = document.createElement('span');
            span.className = 'pagination-page-btn ellipsis';
            span.textContent = '...';
            return span;
        }

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                container.appendChild(createPageBtn(i, i === current));
            }
        } else {
            if (current <= 5) {
                for (let i = 1; i <= 6; i++) {
                    container.appendChild(createPageBtn(i, i === current));
                }
                container.appendChild(createEllipsis());
                container.appendChild(createPageBtn(totalPages, totalPages === current));
            } else if (current >= totalPages - 4) {
                container.appendChild(createPageBtn(1, 1 === current));
                container.appendChild(createEllipsis());
                for (let i = totalPages - 5; i <= totalPages; i++) {
                    container.appendChild(createPageBtn(i, i === current));
                }
            } else {
                container.appendChild(createPageBtn(1, 1 === current));
                container.appendChild(createEllipsis());
                for (let i = current - 1; i <= current + 1; i++) {
                    container.appendChild(createPageBtn(i, i === current));
                }
                container.appendChild(createEllipsis());
                container.appendChild(createPageBtn(totalPages, totalPages === current));
            }
        }
    }

    // Setas de navegação da Categoria 3
    const btnObrasPrev = document.getElementById('btn-obras-prev');
    const btnObrasNext = document.getElementById('btn-obras-next');

    if (btnObrasPrev) {
        btnObrasPrev.addEventListener('click', () => {
            if (step3State.cat3.currentPage > 1) {
                step3State.cat3.currentPage--;
                renderObrasCat3();
            }
        });
    }

    if (btnObrasNext) {
        btnObrasNext.addEventListener('click', () => {
            const totalPages = Math.ceil(getFilteredObrasCat3().length / step3State.cat3.itemsPerPage);
            if (step3State.cat3.currentPage < totalPages) {
                step3State.cat3.currentPage++;
                renderObrasCat3();
            }
        });
    }

    // Eventos dos Inputs de Filtros
    ['titulo', 'tema', 'codigo', 'autores', 'editora'].forEach(filterKey => {
        const input = document.getElementById(`filtro-${filterKey}`);
        if (input) {
            input.addEventListener('input', (e) => {
                step3State.cat3.filters[filterKey] = e.target.value.trim();
                step3State.cat3.currentPage = 1;
                renderObrasCat3();
            });
        }
    });

    // Botão Limpar Dados da Etapa 3
    const btnLimparStep3 = document.getElementById('btn-limpar-dados-step3');
    if (btnLimparStep3) {
        btnLimparStep3.addEventListener('click', () => {
            Object.keys(step3State.cat1.acervos).forEach(k => step3State.cat1.acervos[k] = 0);
            Object.keys(step3State.cat2.acervos).forEach(k => step3State.cat2.acervos[k] = 0);
            step3State.cat3.selected.clear();

            step3State.cat1.notDesired = false;
            step3State.cat2.notDesired = false;
            step3State.cat3.notDesired = false;

            const sw1 = document.getElementById('switch-cat1');
            const sw2 = document.getElementById('switch-cat2');
            const sw3 = document.getElementById('switch-cat3');
            if (sw1) sw1.checked = false;
            if (sw2) sw2.checked = false;
            if (sw3) sw3.checked = false;

            updateAcervoCardsUI('cat1');
            updateAcervoCardsUI('cat2');
            renderObrasCat3();
        });
    }

    // ==========================================================================
    // MODAL DE DETALHES DOS LIVROS DO ACERVO (PADRÃO DS-GOV / FIGMA)
    // ==========================================================================
    const modalDetalhesAcervo = document.getElementById('modal-detalhes-acervo');
    const modalDetalhesTitulo = document.getElementById('modal-detalhes-titulo');
    const modalLivrosContainer = document.getElementById('modal-livros-container');
    const btnCloseModalDetalhes = document.getElementById('btn-close-modal-detalhes');
    const btnFecharModalDetalhes = document.getElementById('btn-fechar-modal-detalhes');

    const titulosLivrosAcervo = [
        "A Bolsa Amarela", "Marcelo, Marmelo, Martelo", "O Menino Maluquinho", "A Casa Sonolenta",
        "Chapeuzinho Amarelo", "Ou Isto ou Aquilo", "Reinações de Narizinho", "O Pequeno Príncipe",
        "O Menino no Espelho", "Bisa Bia, Bisa Bel", "Flicts", "A Arca de Noé",
        "O Reizinho Mandão", "Histórias de Tia Nastácia", "O Pica-Pau Amarelo", "O Meu Pé de Laranja Lima",
        "A Cigarra e a Formiga do Pantanal", "A Bruxinha Atrapalhada", "O Fantástico Mistério de Feiurinha", "Cavalhadas de Pirenópolis",
        "Lili Inventa o Mundo", "Uma Ideia Toda Azul", "Poemas para Brincar", "Palavras, Muitas Palavras",
        "O Grúfalo na Floresta", "A Galinha Xadrez", "De Olho nas Penas", "O Pintor de Lembranças",
        "A Flor da Primavera", "O Sapo Cururu e o Jacaré", "O Peixinho Dourado do Rio São Francisco", "O Jardim Encantado",
        "O Sol e a Lua no Sertão", "O Vento e a Pipa Colorida", "Cores da Minha Terra", "Cantigas de Roda e Acalanto",
        "Os Bichos do Brasil", "O Castelo de Areia da Praia", "Histórias da Floresta Viva", "O Trem de Brinquedo da Estação",
        "O Segredo da Borboleta Azul", "Um Dia no Parque das Águas", "A Tartaruga e a Lebre Moderna", "O Passarinho Cantor da Manhã",
        "O Espelho Mágico da Vovó", "A Árvore Generosa da Escola", "Ciranda dos Sonhos da Infância", "O Barquinho de Papel no Lago"
    ];

    const editorasAcervo = [
        "Editora Moderna", "Companhia das Letrinhas", "FTD Educação", "Editora Salamandra",
        "Editora Ática", "Editora Scipione", "Cortez Editora", "Editora Melhoramentos",
        "Editora Paulinas", "Editora Biruta", "Editora do Brasil", "Pequena Zahar"
    ];

    let currentModalLivros = [];

    function generateAcervoBooks(acervoId, count) {
        const total = parseInt(count, 10) || 48;
        const list = [];
        const isCreche = acervoId.includes('creche');
        const segmentoPrefix = isCreche ? 'CR' : 'PE';

        for (let i = 1; i <= total; i++) {
            const numStr = String(i).padStart(2, '0');
            const codNum = String(i).padStart(3, '0');
            const titulo = titulosLivrosAcervo[(i - 1) % titulosLivrosAcervo.length];
            const editora = editorasAcervo[(i - 1) % editorasAcervo.length];
            const codigo = `PNLD2026-${segmentoPrefix}${acervoId.replace(/[^0-9]/g, '') || '01'}-${codNum}`;

            list.push({
                num: numStr,
                codigo: codigo,
                titulo: `${titulo}`,
                editora: editora
            });
        }
        return list;
    }

    function renderModalLivrosList() {
        if (!modalLivrosContainer) return;
        modalLivrosContainer.innerHTML = '';

        currentModalLivros.forEach(book => {
            const row = document.createElement('div');
            row.className = 'modal-livro-row';
            row.innerHTML = `
                <div class="modal-livro-left">
                    <div class="modal-livro-num">${book.num}</div>
                    <div class="modal-livro-info">
                        <div class="modal-livro-title">${book.titulo}</div>
                        <div class="modal-livro-editora">${book.editora}</div>
                    </div>
                </div>
                <span class="modal-livro-codigo">${book.codigo}</span>
            `;
            modalLivrosContainer.appendChild(row);
        });
    }

    function openModalDetalhesAcervo(acervoId, title, count) {
        if (!modalDetalhesAcervo) return;

        if (modalDetalhesTitulo) {
            modalDetalhesTitulo.textContent = `Livros do Acervo — ${title}`;
        }

        currentModalLivros = generateAcervoBooks(acervoId, count);
        renderModalLivrosList();

        modalDetalhesAcervo.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModalDetalhes() {
        if (modalDetalhesAcervo) {
            modalDetalhesAcervo.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    if (btnCloseModalDetalhes) btnCloseModalDetalhes.addEventListener('click', closeModalDetalhes);
    if (btnFecharModalDetalhes) btnFecharModalDetalhes.addEventListener('click', closeModalDetalhes);

    if (modalDetalhesAcervo) {
        modalDetalhesAcervo.addEventListener('click', (e) => {
            if (e.target === modalDetalhesAcervo) closeModalDetalhes();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalDetalhesAcervo && modalDetalhesAcervo.style.display === 'flex') {
            closeModalDetalhes();
        }
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('.link-ver-livros');
        if (link) {
            const card = link.closest('.acervo-card');
            const acervoId = card ? card.getAttribute('data-id') : 'acervo-1';
            const title = card ? card.getAttribute('data-title') + ' (' + card.getAttribute('data-subtitle') + ')' : 'Acervo';
            const count = card ? card.getAttribute('data-count') : 48;
            openModalDetalhesAcervo(acervoId, title, count);
        }
    });

    // ==========================================================================
    // ETAPA 4: FINALIZAÇÃO E PRÉVIA DA ATA
    // ==========================================================================
    const txtObservacoesFinalizacao = document.getElementById('txt-observacoes-finalizacao');
    const charCounterObservacoes = document.getElementById('char-counter-observacoes');

    if (txtObservacoesFinalizacao && charCounterObservacoes) {
        txtObservacoesFinalizacao.addEventListener('input', () => {
            const remaining = 3000 - txtObservacoesFinalizacao.value.length;
            charCounterObservacoes.textContent = `Total de caracteres restantes: ${remaining}`;
        });
    }

    /**
     * Aplica máscara de proteção de dados sensíveis (LGPD - Lei nº 13.709/2018) no CPF.
     * Exemplo: 123.***.***-00
     * @param {string} cpf - CPF com ou sem formatação
     * @returns {string} CPF mascarado para exibição pública/prévia
     */
    function mascararCPF(cpf) {
        if (!cpf || typeof cpf !== 'string') return 'Não informado';
        const trimmed = cpf.trim();
        if (!trimmed) return 'Não informado';

        // Se já estiver mascarado
        if (/^\d{3}\.\*{3}\.\*{3}-\d{2}$/.test(trimmed)) {
            return trimmed;
        }

        const apenasDigitos = trimmed.replace(/\D/g, '');

        if (apenasDigitos.length === 11) {
            return `${apenasDigitos.substring(0, 3)}.***.***-${apenasDigitos.substring(9, 11)}`;
        }

        if (apenasDigitos.length === 10) {
            return `${apenasDigitos.substring(0, 3)}.***.***-${apenasDigitos.substring(8, 10)}`;
        }

        if (apenasDigitos.length >= 5) {
            return `${apenasDigitos.substring(0, 3)}.***.***-${apenasDigitos.slice(-2)}`;
        }

        return trimmed;
    }

    const btnVisualizarAta = document.getElementById('btn-visualizar-ata');
    const modalPreviaAta = document.getElementById('modal-previa-ata');
    const previaAtaContent = document.getElementById('previa-ata-content');
    const btnFecharPreviaTop = document.getElementById('btn-fechar-previa-top');
    const btnFecharPreviaBottom = document.getElementById('btn-fechar-previa-bottom');
    const btnImprimirPrevia = document.getElementById('btn-imprimir-previa');

    if (btnVisualizarAta) {
        btnVisualizarAta.addEventListener('click', () => {
            if (!previaAtaContent) return;

            const now = new Date();
            const dataHoraStr = now.toLocaleDateString('pt-BR') + ', ' + now.toLocaleTimeString('pt-BR');
            const randomProtocol = 'PNLD-' + Math.random().toString(36).substring(2, 10).toUpperCase();

            const diretor = document.getElementById('input-diretor') ? document.getElementById('input-diretor').value : '';
            const cpf = document.getElementById('input-cpf-responsavel') ? document.getElementById('input-cpf-responsavel').value : '';
            const cpfMascarado = mascararCPF(cpf);
            const dataReuniaoVal = document.getElementById('input-data-reuniao') ? document.getElementById('input-data-reuniao').value : '';
            const horaInicioVal = document.getElementById('input-hora-inicio') ? document.getElementById('input-hora-inicio').value : '';
            const horaTerminoVal = document.getElementById('input-hora-termino') ? document.getElementById('input-hora-termino').value : '';
            const processoEscolhaVal = document.getElementById('txt-processo-escolha') ? document.getElementById('txt-processo-escolha').value : '';

            let partListStr = 'Nenhum participante adicionado.';
            if (participantes.length > 0) {
                partListStr = participantes.map(p => `${p.nome} (${p.funcao})`).join(', ');
            }

            // Matriz de Avaliação
            let caracteristicasHtml = '<ul>';
            const critCaracteristicas = [
                "1. Adequação à faixa etária e aos objetivos pedagógicos",
                "2. Qualidade textual e coerência",
                "3. Ilustrações e projeto gráfico",
                "4. Diversidade temática e cultural",
                "5. Representatividade e inclusão",
                "6. Estímulo à imaginação e criatividade",
                "7. Adequação linguística",
                "8. Coerência com a proposta pedagógica",
                "9. Durabilidade e qualidade material",
                "10. Legibilidade tipográfica",
                "11. Presença de elementos paratextuais",
                "12. Articulação com práticas de leitura",
                "13. Potencial para mediação docente",
                "14. Atualidade das temáticas"
            ];
            critCaracteristicas.forEach((crit, i) => {
                const nota = step2Ratings.caracteristicas[i + 1];
                caracteristicasHtml += `<li>${crit}: <strong>${nota !== null && nota !== undefined ? nota : 'Pendente'}</strong> / 5</li>`;
            });
            caracteristicasHtml += '</ul>';

            let pedagogicosHtml = '<ul>';
            const critPedagogicos = [
                "1. Clareza das informações apresentadas",
                "2. Rigor conceitual",
                "3. Atualização dos conteúdos",
                "4. Referências bibliográficas",
                "5. Recursos de apoio ao professor",
                "6. Sugestões de atividades",
                "7. Coerência com a BNCC"
            ];
            critPedagogicos.forEach((crit, i) => {
                const nota = step2Ratings.pedagogicos[i + 1];
                pedagogicosHtml += `<li>${crit}: <strong>${nota !== null && nota !== undefined ? nota : 'Pendente'}</strong> / 5</li>`;
            });
            pedagogicosHtml += '</ul>';

            // Escolha das Obras
            let cat1Resumo = '';
            if (step3State.cat1.notDesired) {
                cat1Resumo = '<em>Não deseja receber a Categoria 1 — Creche</em>';
            } else {
                const itens = [];
                Object.entries(step3State.cat1.acervos).forEach(([k, v]) => {
                    if (v > 0) {
                        const num = k.replace('creche-', '');
                        itens.push(`Acervo Creche ${num} (${v} un.)`);
                    }
                });
                cat1Resumo = itens.length > 0 ? itens.join(', ') : 'Nenhum acervo selecionado';
            }

            let cat2Resumo = '';
            if (step3State.cat2.notDesired) {
                cat2Resumo = '<em>Não deseja receber a Categoria 2 — Pré-Escola</em>';
            } else {
                const itens = [];
                Object.entries(step3State.cat2.acervos).forEach(([k, v]) => {
                    if (v > 0) {
                        const num = k.replace('pre-', '');
                        itens.push(`Acervo Pré-Escola ${num} (${v} un.)`);
                    }
                });
                cat2Resumo = itens.length > 0 ? itens.join(', ') : 'Nenhum acervo selecionado';
            }

            let cat3Resumo = '';
            if (step3State.cat3.notDesired) {
                cat3Resumo = '<em>Não deseja receber a Categoria 3 — Obras de Apoio Pedagógico</em>';
            } else {
                const itens = Array.from(step3State.cat3.selected);
                cat3Resumo = itens.length > 0 ? itens.map(id => `Obra ${id}`).join(', ') : 'Nenhuma obra selecionada';
            }

            const observacoesVal = txtObservacoesFinalizacao ? txtObservacoesFinalizacao.value : '';
            const declaracaoAceita = document.getElementById('check-declaracao') && document.getElementById('check-declaracao').checked ? 'Aceita' : 'Não aceita';

            previaAtaContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 24px;">
                    <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">ATA DE ESCOLHA – PNLD</h3>
                    <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 600; color: #555;">Protocolo: ${randomProtocol} — Gerada em ${dataHoraStr}</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="border-bottom: 1px solid #1351b4; padding-bottom: 4px; font-size: 14px; font-weight: bold; color: #1351b4; margin-bottom: 12px;">1. Identificação</h4>
                    <p style="margin: 4px 0;"><strong>INEP:</strong> 53009720</p>
                    <p style="margin: 4px 0;"><strong>Escola:</strong> CAIC UNESCO - <strong>UF:</strong> DF - <strong>Município:</strong> Brasília</p>
                    <p style="margin: 4px 0;"><strong>Rede:</strong> Estadual - <strong>Dependência:</strong> Pública</p>
                    <p style="margin: 4px 0;"><strong>Responsável:</strong> ${diretor || 'Não informado'} - <strong>CPF:</strong> ${cpfMascarado}</p>
                    <p style="margin: 4px 0;"><strong>Reunião realizada em:</strong> ${dataReuniaoVal || 'Não informada'}, das ${horaInicioVal || 'Não informada'} às ${horaTerminoVal || 'Não informada'}</p>
                    <p style="margin: 4px 0;"><strong>Participantes:</strong> ${partListStr}</p>
                    <p style="margin: 4px 0; white-space: pre-wrap;"><strong>Processo de escolha:</strong> ${processoEscolhaVal || 'Não informado'}</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="border-bottom: 1px solid #1351b4; padding-bottom: 4px; font-size: 14px; font-weight: bold; color: #1351b4; margin-bottom: 12px;">2. Matrizes de avaliação</h4>
                    <p style="margin: 8px 0 4px 0; font-weight: 600;">Características das obras:</p>
                    ${caracteristicasHtml}
                    <p style="margin: 12px 0 4px 0; font-weight: 600;">Informações e recursos pedagógicos:</p>
                    ${pedagogicosHtml}
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="border-bottom: 1px solid #1351b4; padding-bottom: 4px; font-size: 14px; font-weight: bold; color: #1351b4; margin-bottom: 12px;">3. Escolha das obras</h4>
                    <ul style="line-height: 1.8;">
                        <li><strong>Categoria 1 — Creche:</strong> ${cat1Resumo}</li>
                        <li><strong>Categoria 2 — Pré-Escola:</strong> ${cat2Resumo}</li>
                        <li><strong>Categoria 3 — Obras de Apoio Pedagógico:</strong> ${cat3Resumo}</li>
                    </ul>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="border-bottom: 1px solid #1351b4; padding-bottom: 4px; font-size: 14px; font-weight: bold; color: #1351b4; margin-bottom: 12px;">4. Observações e declaração</h4>
                    <p style="margin: 4px 0; white-space: pre-wrap;"><strong>Observações:</strong> ${observacoesVal || 'Sem observações adicionais.'}</p>
                    <p style="margin: 4px 0;"><strong>Declaração de conformidade:</strong> ${declaracaoAceita}</p>
                </div>
            `;

            if (modalPreviaAta) modalPreviaAta.style.display = 'flex';
        });
    }

    if (btnFecharPreviaTop) {
        btnFecharPreviaTop.addEventListener('click', () => {
            if (modalPreviaAta) modalPreviaAta.style.display = 'none';
        });
    }

    if (btnFecharPreviaBottom) {
        btnFecharPreviaBottom.addEventListener('click', () => {
            if (modalPreviaAta) modalPreviaAta.style.display = 'none';
        });
    }

    if (modalPreviaAta) {
        modalPreviaAta.addEventListener('click', (e) => {
            if (e.target === modalPreviaAta) modalPreviaAta.style.display = 'none';
        });
    }

    if (btnImprimirPrevia) {
        btnImprimirPrevia.addEventListener('click', () => {
            const printableAta = document.getElementById('printable-ata');
            if (printableAta && previaAtaContent) {
                printableAta.innerHTML = `
                    <div class="print-page">
                        <div class="print-header">
                            <img src="imagens/EN_PNLD_TRINCA 1.svg" alt="PNLD Logo" style="height: 35px; margin-right: 12px;">
                            <span>PROGRAMA NACIONAL DO LIVRO E DO MATERIAL DIDÁTICO</span>
                        </div>
                        ${previaAtaContent.innerHTML}
                        <div class="print-footer-banner">
                            Documento gerado eletronicamente em conformidade com as diretrizes do FNDE/MEC e com a LGPD (Lei nº 13.709/2018).
                        </div>
                    </div>
                `;
            }
            window.print();
        });
    }

    // ==========================================================================
    // INICIALIZAÇÃO GERAL
    // ==========================================================================
    renderParticipantes();
    updateRatingsUI();
    initAcervoSteppers();
    initSwitches();

    // Inicializa UI da Etapa 3 com os dados do Figma
    updateAcervoCardsUI('cat1');
    updateAcervoCardsUI('cat2');
    renderObrasCat3();

    // Exibe a etapa ativa
    updateStepVisibility();
});
