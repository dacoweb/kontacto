(function () {

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
                console.error('Error GET:', err);
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
            .then(function (res) {
                if (!res.ok) {
                    throw new Error('Error en POST');
                }
                return res;
            })
            .then(function () {
                form.reset();
                loadContacts();
            })
            .catch(function (err) {
                console.error('Error POST:', err);
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

    window.addEventListener('load', init);

})();