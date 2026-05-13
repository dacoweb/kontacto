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
    var list = null;

    function init() {
        form = document.getElementById('contactForm');
        list = document.getElementById('messageList');

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
        list.innerHTML = '';

        messages.forEach(function (msg) {
            var li = document.createElement('li');
            li.textContent = msg.name + ' - ' + msg.subject;
            list.appendChild(li);
        });
    }

    function submitForm() {
        var formData = new FormData(form);

        var payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
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

    window.addEventListener('load', init);

})();
