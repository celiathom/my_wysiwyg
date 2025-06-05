export class MyWysiwyg {
    constructor(cible, option = {}) {
        if (!cible) {
            throw new Error("Besoin d'un élément cible");
        }
        if (option.buttons == null) {
            var ButtonList = ["bold", "italic", "color", "underline", "fontsize", "link", "strike", "save","reset","TextAlign"];
        } else {
            var ButtonList = option.buttons;
        }
        if (option.Showimage == null) {
            var Showimage = true;
        } else {
            var Showimage = option.Showimage;
        }

        // Création des éléments
        let zoneDeText = document.createElement("p");
        zoneDeText.contentEditable = "true";
        zoneDeText.classList.add("zoneDeText");

        let Barre_doutils = document.createElement("div");
        Barre_doutils.classList.add("barredoutils");
        Barre_doutils.id = 'barre_doutil';

        let image = document.createElement("img");
        image.alt = "image de khaby";
        image.src = "assets/khaby.png";
        image.id = "khaby";

        let P_intro = document.createElement("div");
        P_intro.id = "intro";
        P_intro.innerText = "Entrez votre texte !";


        // localStorage : Restauration du contenu sauvegardé uniquement lors de l'initialisation
        const savedContent = localStorage.getItem("wysiwygContent");
        if (savedContent) {
            zoneDeText.innerHTML = savedContent;  // Si du contenu est sauvegardé, on le charge.
        } else {
            zoneDeText.innerHTML = "<p>Entrez votre texte ici...</p>";  // Texte par défaut si rien dans le localStorage
        }

        // Sauvegarde automatique toutes les minutes
        this.autoSaveInterval = setInterval(() => {
            this.saveContent(zoneDeText);  // Sauvegarde toutes les minutes
        }, 60000); // 60 000 ms = 1 minute





        // Création des boutons en fonction des options
        let Button_bold = null;
        let Button_italic = null;
        let Button_color = null;
        let Button_underline = null;
        let Button_fontsize = null;
        let Button_link = null;
        let Button_Strike = null;
        let Button_save = null; 
        let Button_reset = null; 
        let BarreDeJustification = null; 



        if (ButtonList.includes("bold")) {
            Button_bold = document.createElement("button");
            Button_bold.innerText = "B";
            Button_bold.title = "Met la sélection en gras";
            Button_bold.onclick = () => this.Bold();
            Barre_doutils.appendChild(Button_bold);
        }
        if (ButtonList.includes("italic")) {
            Button_italic = document.createElement("button");
            Button_italic.innerText = "I";
            Button_italic.title = "Met la sélection en italique";
            Button_italic.onclick = () => this.Italic();
            Barre_doutils.appendChild(Button_italic);
        }
        if (ButtonList.includes("color")) {
            Button_color = document.createElement("button");
            Button_color.innerText = "C";
            Button_color.title = "Change la couleur de la sélection";
            Button_color.onclick = () => this.Color();
            Barre_doutils.appendChild(Button_color);
        }
        if (ButtonList.includes("underline")) {
            Button_underline = document.createElement("button");
            Button_underline.innerText = "U";
            Button_underline.title = "Souligne la sélection";
            Button_underline.onclick = () => this.Underline();
            Barre_doutils.appendChild(Button_underline);
        }
        if (ButtonList.includes("strike")) {
            Button_Strike = document.createElement("button");
            Button_Strike.innerText = "Ʉ";
            Button_Strike.title = "Barre la sélection";
            Button_Strike.onclick = () => this.Strike();
            Barre_doutils.appendChild(Button_Strike);
        }
        if (ButtonList.includes("fontsize")) {
            Button_fontsize = document.createElement("select");
            Button_fontsize.title = "Change la taille de la typo";

            let sizes = ["16px", "18px", "20px", "24px", "32px"];
            sizes.forEach(size => {
                let opt = document.createElement("option");
                opt.value = size;
                opt.innerText = size.replace("px", "");
                Button_fontsize.appendChild(opt);
            });

            Button_fontsize.addEventListener("change", () => {
                this.Size(Button_fontsize.value);
            });
            Barre_doutils.appendChild(Button_fontsize);
        }
        if (ButtonList.includes("link")) {
            Button_link = document.createElement("button");
            Button_link.innerText = "L";
            Button_link.onclick = () => this.Link();
            Barre_doutils.appendChild(Button_link);
        }

        // Ajout du bouton "Enregistrer"
        if (ButtonList.includes("save")) {
            Button_save = document.createElement("button");
            Button_save.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/></svg>';
            Button_save.title = "Enregistre le contenu de l'éditeur";
            Button_save.onclick = () => this.saveContent(zoneDeText); // Sauvegarde explicite du contenu
            Barre_doutils.appendChild(Button_save);
        }

        if (ButtonList.includes("reset")) {
            Button_reset = document.createElement("button");
            Button_reset.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
            Button_reset.title = "Restaure le texte par defaut";
            Button_reset.onclick = () => this.reset(zoneDeText); // Sauvegarde explicite du contenu
            Barre_doutils.appendChild(Button_reset);
        }

        //ajout de la barre doutils d'alignement de texte
        if (ButtonList.includes("TextAlign")) {
            BarreDeJustification = document.createElement("div");
            BarreDeJustification.classList.add('BarreAlign')
            let Button_Left = document.createElement("button");
            let Button_Right = document.createElement("button");
            let Button_Center = document.createElement("button");
            let Button_Justification = document.createElement("button");

            Button_Left.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>'
            Button_Right.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>';
            Button_Center.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>';
            Button_Justification.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M120-120v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Z"/></svg>';

            Button_Left.onclick = () => this.TexteAlign("start");
            Button_Right.onclick = () => this.TexteAlign("end");
            Button_Center.onclick = () => this.TexteAlign("center");
            Button_Justification.onclick = () => this.TexteAlign("justify");

            BarreDeJustification.appendChild(Button_Left);
            BarreDeJustification.appendChild(Button_Right);
            BarreDeJustification.appendChild(Button_Center);
            BarreDeJustification.appendChild(Button_Justification);
        }


        let modifiable  = document.createElement("label");
        modifiable.innerText = "Modifiable : "

        //ajout du bouton modifiable
        let Modif_Button = document.createElement("input");
        Modif_Button.type = "checkbox";
        Modif_Button.checked = true;
        Modif_Button.onchange = () => {
            console.log(Modif_Button.value)
            if(Modif_Button.checked == true){
                zoneDeText.contentEditable = true;
            }else{
                zoneDeText.contentEditable = false;
            }
        }

        // Ajout des éléments dans la page HTML
        if(Showimage == true){
            cible.appendChild(image)
        }
        cible.appendChild(P_intro);
        cible.appendChild(zoneDeText);
        cible.appendChild(modifiable);
        cible.appendChild(Modif_Button);

        cible.appendChild(Barre_doutils);
        cible.appendChild(BarreDeJustification);




        //alerte a la fermeture 
        window.addEventListener("beforeunload", (event) => {
            if (zoneDeText.innerHTML != localStorage.getItem("wysiwygContent")) {
                confirm("sur?");
                event.preventDefault();
            }
        });

    }

    // Fonction pour sauvegarder le contenu dans le localStorage
    saveContent(zoneDeText) {
        if (zoneDeText && zoneDeText.innerHTML.trim() !== "") {  // Sauvegarde uniquement si du contenu existe
            localStorage.setItem("wysiwygContent", zoneDeText.innerHTML);
        }
    }
    //restaure le texte par default
    reset(zoneDeText){
        zoneDeText.innerHTML = "<p>Entrez votre texte ici...</p>";
        localStorage.setItem("wysiwygContent", "");
    }

    Bold() {
        let selection = window.getSelection();
        if (!selection.rangeCount) return;

        let range = selection.getRangeAt(0);
        let parent = range.commonAncestorContainer;

        if (parent.nodeType === 3 && parent.parentNode) {
            parent = parent.parentNode;
        }

        if (parent.tagName === "STRONG") {
            let textNode = document.createTextNode(parent.textContent);
            parent.replaceWith(textNode);
        } else {
            let strong = document.createElement("strong");
            strong.appendChild(range.extractContents());
            range.insertNode(strong);
        }
        selection.removeAllRanges();

        // Sauvegarde après chaque modification de style
        this.saveContent(document.querySelector('.zoneDeText'));
    }

    Italic() {
        let selection = document.getSelection();
        if (!selection.rangeCount) return;

        let range = selection.getRangeAt(0);
        let parent = range.commonAncestorContainer.parentNode;

        if (parent.tagName === "EM") {
            let textNode = document.createTextNode(parent.textContent);
            parent.replaceWith(textNode);
        } else {
            let em = document.createElement("em");
            em.appendChild(range.extractContents());
            range.insertNode(em);
        }
        selection.removeAllRanges();

        // Sauvegarde après chaque modification de style
        this.saveContent(document.querySelector('.zoneDeText'));
    }

    Color() {
        let selection = document.getSelection();
        if (!selection.rangeCount) return;

        let range = selection.getRangeAt(0);
        let parent = range.commonAncestorContainer.parentNode;

        if (parent.tagName === "SPAN" && parent.style.color) {
            let textNode = document.createTextNode(parent.textContent);
            parent.replaceWith(textNode);
        } else {
            let colorPicker = document.createElement("input");
            colorPicker.type = "color";
            colorPicker.style.position = "absolute";
            document.body.appendChild(colorPicker);

            colorPicker.addEventListener("input", function () {
                let color = colorPicker.value;
                let span = document.createElement("span");
                span.style.color = color;
                span.appendChild(range.extractContents());
                range.insertNode(span);
                document.body.removeChild(colorPicker);
            });

            colorPicker.click();
        }
        selection.removeAllRanges();

        // Sauvegarde après chaque modification de style
        this.saveContent(document.querySelector('.zoneDeText'));
    }

    Strike() {
        let selection = window.getSelection();
        if (!selection.rangeCount) return;

        let range = selection.getRangeAt(0);
        let parent = range.commonAncestorContainer.parentNode;

        if (parent.tagName === "S") {
            let textNode = document.createTextNode(parent.textContent);
            parent.replaceWith(textNode);
        } else {
            let s = document.createElement("s");
            s.appendChild(range.extractContents());
            range.insertNode(s);
        }
        selection.removeAllRanges();

        // Sauvegarde après chaque modification de style
        this.saveContent(document.querySelector('.zoneDeText'));
    }

    Underline() {
        let selection = window.getSelection();
        if (!selection.rangeCount) return;

        let range = selection.getRangeAt(0);
        let parent = range.commonAncestorContainer.parentNode;

        if (parent.tagName === "U") {
            let textNode = document.createTextNode(parent.textContent);
            parent.replaceWith(textNode);
        } else {
            let u = document.createElement("u");
            u.appendChild(range.extractContents());
            range.insertNode(u);
        }
        selection.removeAllRanges();

        // Sauvegarde après chaque modification de style
        this.saveContent(document.querySelector('.zoneDeText'));
    }

    Size(size) {
        let selection = window.getSelection();
        if (!selection.rangeCount) return;

        let range = selection.getRangeAt(0);
        let span = document.createElement("span");
        span.style.fontSize = size;
        span.appendChild(range.extractContents());
        range.insertNode(span);
        selection.removeAllRanges();

        // Sauvegarde après chaque modification de style
        this.saveContent(document.querySelector('.zoneDeText'));
    }

    Link() {
        let selection = window.getSelection();
        if (!selection.rangeCount) return;

        let range = selection.getRangeAt(0);
        let link = prompt("Entrez l'URL du lien :");

        if (link) {
            let a = document.createElement("a");
            a.href = link;
            a.target = "_blank";
            a.appendChild(range.extractContents());
            range.insertNode(a);
        }
        selection.removeAllRanges();

        // Sauvegarde après chaque modification de style
        this.saveContent(document.querySelector('.zoneDeText'));
    }
    //fonction d'alignement de texte

    TexteAlign(type){
        let selection = window.getSelection();
        if (!selection.rangeCount) return;

        let range = selection.getRangeAt(0);
        let parent = range.commonAncestorContainer.parentNode;

        if (parent.tagName === "div") {
            parent.style.textAlign = type;
        } else {
            let div = document.createElement("div");
            div.style.textAlign = type;
            div.appendChild(range.extractContents());
            range.insertNode(div);
        }
        selection.removeAllRanges();

        // Sauvegarde après chaque modification de style
        this.saveContent(document.querySelector('.zoneDeText'));
    }

}