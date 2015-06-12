// ==UserScript==
// @name         IGN Video to HTML5
// @namespace    http://rafasirotheau.com.br
// @version      1.0.0
// @description  Converts IGN Player to default HTML5 Video
// @author       You
// @match        http://www.ign.com/articles/*
// @grant        none
// @require      https://raw.githubusercontent.com/jfriend00/docReady/master/docready.js
// ==/UserScript==


var scriptName = "IGN Video 2 HTML5",
    debug = true,
    version = "1.0.0",
    quality = 540;

function debugThis(msg) {
    if(!debug)
        return false;

    console.log('['+scriptName+' v.'+version+'] '+msg);
}


docReady(function() {
    debugThis("Iniciando script...");
    
    var addStylesOnce = true;
    
    var destaque = document.querySelectorAll('.hero-unit-stage');
        
    var videos = document.querySelectorAll('.video-embed-container');

    if((videos.length + destaque.length) <= 0) {
        debugThis("Nenhum player encontrado. Finalizando o script...");
        return false;
    }
    
    debugThis((videos.length + destaque.length) + " vídeos encontrados!");

    changeVideo2HTML5(videos);


    if(destaque.length) {
        var repeater;
    
        repeater = setInterval(function() {
            var videoDestaque = document.querySelectorAll('.video-widget-container');
            
            if(videoDestaque.length > 0) {
                changeVideo2HTML5(videoDestaque);
                clearInterval(repeater);
                
                debugThis("Tudo pronto. Finalizando o script");
                return false;
            }
            
            debugThis('Aguardando o video destaque...');
        },1000);
    }
       
    function changeVideo2HTML5(videos) {
        
        for(i=0;i<videos.length;i++) {
            var video = videos[i];
            var obj = JSON.parse(video.getAttribute('data-video'));
            var videoPoster = video.getAttribute('data-poster'),
                videoTitle = video.getAttribute('data-video-title');
            var videoUrl = '';
            
            var resolutions='';
            
            for(j=0;j<obj.assets.length;j++) {
                var curr = obj.assets[j];
                if(curr.height == quality) {
                    videoUrl = curr.url;
                    resolutions+= '<a href="'+curr.url+'" class="active">'+curr.height+'</a>';
                }
                else
                    resolutions+= '<a href="'+curr.url+'">'+curr.height+'</a>';

            }
            
            var saida = '';
            
            // Styles
            if(addStylesOnce) {
                saida += '<style type="text/css"> .html5-video-title { background-color: black; color: white; display: block; line-height: 30px; padding: 0; margin: 0; text-align: right; } .html5-video-title span { float: left; margin-left: 10px; } .html5-video-title a { display: inline-block; background: transparent !important; color: #f21818 !important; border-bottom: solid 4px #f21818; line-height: 21px; opacity: 0.5; padding: 0 5px;} .html5-video-title a.active { opacity: 1; cursor: default; }</style>';
                addStylesOnce = false;
            }
            // header
            saida += '<p class="html5-video-title">';
            // Titulo
            saida += '<span>'+videoTitle+'</span>';
            // Resoluções
            saida += resolutions;
            // header fim
            saida += '</p>';
            // Video
            saida += '<video width="'+video.parentNode.clientWidth+'" height="'+video.parentNode.clientHeight+'" controls poster="'+videoPoster+'"><source src="'+videoUrl+'" type="video/mp4">Seu navegador não suporta videos HTML5.</video>';
            
            var container = video.parentNode;
            
            container.innerHTML = saida;
            
            container.querySelector('p').addEventListener("click", function(event){
                event.preventDefault();
                
                if(event.target.classList.contains('active'))
                    return false;
                
                
                
                this.querySelector('.active').classList.remove('active');
                
                event.target.classList.add('active');
                
                
                
                var newVideoUrl = event.target.href;
                
                var currVideo = this.parentNode.querySelector('video');
                
                //currVideo.pause();
                var tempoAtual = currVideo.currentTime;
                
                currVideo.childNodes[0].setAttribute('src', newVideoUrl); 
                
                currVideo.load();
                
                
                currVideo.play();
                
                currVideo.currentTime = tempoAtual;
            
            }, false);

        }
    }
    
    
    
});
