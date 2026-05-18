(function () {

    const tabRegister = document.getElementById('tab-register');
    const tabList = document.getElementById('tab-list');

    const contentRegister = document.getElementById('content-register');
    const contentList = document.getElementById('content-list');

    const alertEl = document.getElementById('alert');
    const alertElBtnClose = document.getElementById('btn-alert-close');

    const successClasses = ['text-blue-800', 'bg-blue-100'];
    const errorClasses = ['text-red-800', 'bg-red-100'];

    var form = null;
    var tbBodyMessages = null;

    function init() {
        form = document.getElementById('contactForm');
        tbBodyMessages = document.querySelector('#tbBodyMessages');

        loadContacts();

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            submitForm();
        });
    }

    function loadContacts() {
        fetch(LIST_URL)
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                renderMessages(data);
            })
            .catch(function (err) {
                console.log('Error GET:', err);
            });
    }

    function renderMessages(messages) {
        tbBodyMessages.innerHTML = '';

        messages.forEach(function (msg) {
            const nuevaFila = tbBodyMessages.insertRow();
            const celda1 = nuevaFila.insertCell(0);
            const celda2 = nuevaFila.insertCell(1);
            celda1.textContent = msg.name + ' - ' + msg.subject;

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Edit";
            btnEditar.className = "btn-edit bg-blue-600 text-white font-semibold py-2 px-4 me-2";
            btnEditar.dataset.messageId = msg.id; 

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Del";
            btnEliminar.className = "btn-delete bg-red-600 text-white font-semibold py-2 px-4 me-2";
            btnEliminar.dataset.messageId = msg.id; 

            celda2.append(btnEditar, btnEliminar);
            celda2.className = "text-center";
        });
    }

    function submitForm() {
        var formData = new FormData(form);

        var payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            messageContactId: formData.get('messageContactId')
        };

        fetch(STORE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (!data.stored) {
                showAlert('Error', data.errors);
                throw new Error('Error en POST');
            }
            showAlert('Success', 'Registro guardado!');
            form.reset();
            loadContacts();
        })
        .catch(function (err) {
            console.log('Error POST:', err);
        });
    }

    function loadContactToEdit(contactId) {
        fetch(EDIT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({
                'id': contactId
            })
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (data.id != undefined && data.id > 0) {
                document.querySelector('input[name="messageContactId"]').value = data.id;
                document.querySelector('input[name="name"]').value = data.name;
                document.querySelector('input[name="email"]').value = data.email;
                document.querySelector('input[name="subject"]').value = data.subject;
                document.querySelector('textarea[name="message"]').value = data.message;
            }
        })
        .catch(function (err) {
            console.log('Error GET:', err);
        });
    }

    function loadContactToDelete(contactId) {

        fetch(DELETE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({
                'id': contactId
            })
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (data.deleted != undefined && data.deleted) {
                loadContacts();
            }
        })
        .catch(function (err) {
            console.log('Error Delete:', err);
        });
    }

    function getCSRFToken() {
        var name = 'csrftoken=';
        var cookies = document.cookie.split(';');

        for (var i = 0; i < cookies.length; i++) {
            var c = cookies[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length);
            }
        }

        return '';
    }

    function activateTab(activeTab, activeContent) {
        [tabRegister, tabList].forEach(tab => {
            tab.classList.remove(
                'text-gray-900',
                'border-b-2',
                'border-blue-500'
            );

            tab.classList.add('text-gray-500');
        });

        [contentRegister, contentList].forEach(content => {
            content.classList.add('hidden');
        });

        activeTab.classList.remove('text-gray-500');

        activeTab.classList.add(
            'text-gray-900',
            'border-b-2',
            'border-blue-500'
        );

        activeContent.classList.remove('hidden');
    }

    function showAlert(msgType, msgText) {
        alertEl.classList.remove('hidden');
        alertEl.classList.add('flex');

        alertEl.classList.remove(...successClasses);
        alertEl.classList.remove(...errorClasses);
        if (msgType == 'Error') {
            alertEl.classList.add(...errorClasses);
            msgText = Object.values(msgText).join('\n');
        } else {
            alertEl.classList.add(...successClasses);
        }
        alertEl.querySelector('#alert-title').innerText = msgType + ':';
        alertEl.querySelector('#alert-msg').innerText = msgText;
    }

    function closeAlert() {
        alertEl.classList.remove(...'flex');
        alertEl.classList.add('hidden');

        alertEl.classList.remove(...successClasses);
        alertEl.classList.remove(...errorClasses);

        alertEl.querySelector('#alert-title').innerText = '';
        alertEl.querySelector('#alert-msg').innerText = '';
    }

    tabRegister.addEventListener('click', () => {
        activateTab(tabRegister, contentRegister);
    });

    tabList.addEventListener('click', () => {
        activateTab(tabList, contentList);
    });

    alertElBtnClose.addEventListener('click', () => {
        closeAlert();
    });

    document.addEventListener('click', function(event) {
        const element = event.target.closest('.btn-edit');
        if (element) {
            loadContactToEdit(element.dataset.messageId);
            document.getElementById('tab-register').click();
        }
    });

    document.addEventListener('click', function(event) {
        const element = event.target.closest('.btn-delete');
        if (element) {
            loadContactToDelete(element.dataset.messageId);
        }
    });

    window.addEventListener('load', init);

})();
