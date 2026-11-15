const body = document.body;
const title = document.getElementById('title');
const buttonOne = document.getElementById('button-one');
const buttonTwo = document.getElementById('button-two');
const spacer = document.createElement('div');
const logo = new Image(145, 145);

function createLogo() {
    logo.src = 'assets/logo.png';
    logo.alt = 'logo';
    body.insertBefore(logo, buttonOne);
}

function createParagraph(text, fontSize = 16) {
    let description = document.createElement('p');
    description.textContent = text;
    description.style.fontSize = `${fontSize}px`;
    spacer.appendChild(description);
}

function createSpacer() {
    body.insertBefore(spacer, buttonOne);
}

function clearPage() {
    document.querySelectorAll('p').forEach(p => p.remove());
    spacer.remove();
    logo.remove();
}

// function settingsPage() {
    
// }

function authorsPage() {
    clearPage();
    createParagraph('Members:');
    createParagraph('Jason Vo');
    createParagraph('Quan Pham');
    createParagraph('Ethan P. Nguyen');
    createParagraph('Le Phan');
    createSpacer();
}

function homePage() {
    clearPage();
    createLogo();
}

(() => {{
    createLogo();
    buttonOne.innerHTML = '⇔ Settings';
    buttonTwo.innerHTML = 'Authors ⇔';
}})();

let currentPage = 'home';

buttonOne.addEventListener('click', () => {
    if (currentPage === 'home') {
        // settingsPage();
        // currentPage = 'settings';
        // buttonOne.innerHTML = 'Back ⇔';
        // buttonTwo.innerHTML = '---';
        window.location.href = "options.html";
    } else if (currentPage === 'settings') {
        homePage();
        currentPage = 'home';
        buttonOne.innerHTML = '⇔ Settings';
        buttonTwo.innerHTML = 'Authors ⇔';
    }
});

buttonTwo.addEventListener('click', () => {
    if (currentPage === 'home') {
        authorsPage();
        currentPage = 'authors';
        buttonOne.innerHTML = '---';
        buttonTwo.innerHTML = '⇔ Back';
    } else if (currentPage === 'authors') {
        homePage();
        currentPage = 'home';
        buttonOne.innerHTML = '⇔ Settings';
        buttonTwo.innerHTML = 'Authors ⇔';
    }
});