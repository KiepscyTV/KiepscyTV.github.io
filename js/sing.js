class Intro{
    constructor(){
        this.text = [
            "W kiepskim świecie kiepskie sprawy",
            "Marne życie i zabawy",
            "Są codzienne awantury",
            "Nie ma dnia bez ostrej rury",
            "",
            "Ojciec biega na bosaka",
            "Jest zadyma i jest draka",
            "Nikt nikomu nie tłumaczy",
            "By spróbować żyć inaczej",
            "",
            "Pa pa pa pa pa pa",
            "To jest właśnie Kiepskich świat",
            "Pa pa pa pa pa pa",
            "Kiespkich życie kiepskich świat",
            "",
            "Są nadzieje i miłości",
            "Są zwycięstwa i radości",
            "Są skandale i hałasy",
            "Na tapczanie wygibasy",
            "",
            "Choć problemy są kosmiczne",
            "Jest tu całkiem sympatycznie",
            "To jest właśnie Kiepskich życie",
            "Zobaczycie uwierzycie"
        ]
    }

    singIntro(speed = 2000){
        this.singLine(speed, 0);
    }

    singLine(speed, lineNumber = 0){
            console.log("%c"+this.text[lineNumber], "color: #306b2a; font-size: 15px; background-color: #eee;");
            if(this.text[lineNumber+1] != undefined)
            setTimeout(()=>{this.singLine(speed, lineNumber+1)}, speed);
    }
}