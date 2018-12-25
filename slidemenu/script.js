    const toggleMnu = document.querySelector('.toggle-mnu');
	toggleMnu.addEventListener('click', function(e){
		e.preventDefault();
		if(this.classList.contains('on')){
            this.classList.remove('on');
            document.getElementById('side-menu').style.width = '40px';
            document.querySelector('.content.visible').classList.remove('ml250');
        }else{
            this.classList.add('on');
            document.getElementById('side-menu').style.width = '250px';
            document.querySelector('.content.visible').classList.add('ml250');
		}
	});
    const sideMenuLinks = document.querySelectorAll('.side-menu__link');
    for(let i=0; i<sideMenuLinks.length; i++){
        sideMenuLinks[i].addEventListener('click', function(e){
            e.preventDefault();
            console.log("this.id", this.dataset.id);
            openContent(e, this.dataset.id);

        });
	};

	function openContent(evt, contentName) {
		hideContent();
		const links = document.getElementsByClassName("side-menu__link");
		for (let i = 0; i < links.length; i++) {
			links[i].className = links[i].className.replace(" active", "");
		}
        document.getElementById(contentName).classList.add("visible");
		document.getElementById(contentName).classList.add('ml250');
		evt.currentTarget.className += " active";
	}
	function hideContent() {
		const content = document.getElementsByClassName("content");
		for (let i = 0; i < content.length; i++) {
			content[i].classList.remove("visible");
			content[i].classList.remove('ml250');
		}
	}