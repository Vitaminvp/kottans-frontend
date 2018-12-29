const appConfig = {
    apiUrl: 'https://ec-test-react.herokuapp.com/',
    magicNumber: 2,
    width: 4,
    height: 4,
    arrImgSrc = []
};

class Ajax {
    static get(url, responseCallback) {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    responseCallback(JSON.parse(xhr.response));
                }
            }
        }
    }
}


const shuffle = arr => arr.sort(() => 0.5 - Math.random());

const generateId = () => {
    return '_'+Math.random().toString(36).substr(2, 9);
};

class Card{
    constructor (target, callback, getterCount, getterId) {
        this.target = target;
        this.callback = callback;
        this.getterCount = getterCount;
        this.getterId = getterId;
        this.render();
        this.id = "";
    }
    render(){
        Ajax.get(`${appConfig.apiUrl}api/v1/pictures`, this.renderItems.bind(this));
    }

   renderItems(ajaxRespons){
        this.Respons = Array.from(ajaxRespons);
        //console.log("this.Respons", this.Respons);
        const fragment = document.createDocumentFragment();
        const flipContainer = document.createElement('div');
        const flipper = document.createElement('div');
        const front = document.createElement('div');
        const back = document.createElement('div');

        const div = document.createElement('div');
        flipContainer.classList.add('flip-container');
        flipper.classList.add('flipper');
        front.classList.add('front');
        back.classList.add('back');
        back.id = generateId();

       flipper.appendChild(front);
       flipper.appendChild(back);
       flipContainer.appendChild(flipper);
       fragment.appendChild(flipContainer);
        let imgsrc = Math.floor(Math.random() * (this.Respons.length));
       back.addEventListener('click', () => {
            let getId  = this.getterId();
            if(this.id !== back.id){
            if(this.getterCount() < appConfig.magicNumber){
                const item = back;
                if(item.classList.contains('on')){
                    item.classList.remove('on');
                } else {
                    item.classList.add('on');
                    this.callback(true, imgsrc, back.id);
                    setTimeout(()=>{
                        item.classList.remove('on');
                    this.callback(false);
                    this.id = "";
                }, 1500);
                }
                this.id = back.id;
            }
        }
        });
        let url = appConfig.apiUrl + this.Respons[ imgsrc ];
       back.innerHTML = `<img src=${url} alt='alt'>`;
        this.target.appendChild(fragment);
    }
}

class Cards{
    constructor (target) {
        this.target = target;
        this.render();
        this.count = 0;
        this.firstPicSrc = '';
        this.secondPicSrc = '';
        this.firstId = '';
        this.secondId = '';
    }
    countInc(bool, src, id ){
        if(bool){
            this.count++;
            if(this.firstPicSrc === src && this.firstId !== id){
                const firstCard = document.getElementById(id);
                const secondCard = document.getElementById(this.firstId);
                firstCard.classList.add('end');
                secondCard.classList.add('end');
                setTimeout(() => {
                    firstCard.classList.add('hidden');
                    secondCard.classList.add('hidden');
                }, 250);
                this.firstPicSrc = '';
                return false;
            }
            this.secondPicSrc = this.firstPicSrc;
            this.firstPicSrc = src;
            this.secondId = this.firstId;
            this.firstId = id;
        } else {
            this.count--;
        }
    }
    countGet(){
        return this.count;
    }
    idGet(){
        return this.secondId;
    }
    render(){
        this.loader = document.createElement('div');
        this.btn = document.createElement('button');
        this.btn.innerHTML = "START NEW GAME";
        this.btn.className = "btn";
        this.target.appendChild(this.btn);
        this.output = document.createElement('div');
        this.output.className = "output";
        this.output.style.display = "flex";
        this.btn.addEventListener('click', () => {
            this.output.innerHTML = "";
            this.output.appendChild(this.loader);
            this.loader.innerHTML = '<img src="https://vitaminvp.github.io/WA/client/assets/images/ajax-loader.gif">';
            this.target.appendChild(this.output);
            Ajax.get(`${appConfig.apiUrl}api/v1/items`, this.renderItems.bind(this));
        });
    }
    renderItems(ajaxRespons){
        this.output.innerHTML = "";
        //let {width, height} = ajaxRespons;
        let width = appConfig.width;
        let height = appConfig.height;
        const docFragment  = document.createDocumentFragment();
        for (let i=0; i < height; i++){
            let div = document.createElement('div');
            for (let j=0; j < width; j++){
                new Card(div, this.countInc.bind(this), this.countGet.bind(this), this.idGet.bind(this));
            }
            docFragment.appendChild(div);
        }
        this.output.appendChild(docFragment);
    }
}
const app  = document.querySelector("#app");
const cards = new Cards(app);