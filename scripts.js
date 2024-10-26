//dados da API com imagens 
async function fetchMediaFromNasa(searchQuery) {
    try {
//url da API da NASA para busca de imagens
        const apiUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}`;
//requisição GET a API da NASA para dados da busca    
        const response = await fetch(apiUrl);   
        const data = await response.json();    //converter a resposta da busca para json
        
        const imagesContainer = document.getElementById("images-container");
        imagesContainer.innerHTML = ""; //limpar a resposta da busca

        //verificar se a busca retornou dados       
        if(!isValidData(data)) {
            console.error("Nenhum resultado encontrado.");
            return;
        }
        
        for(const item of data.collection.items) {
            const mediaType = item.data[0].media_type;

//faz uma nova requisição GET ao link do recurso (imagem ou vídeos)
        const mediaData = await fetch(item.href).then(response => response.json()); 
        

//pega o URL correto da mídia (imagem ou vídeos) com base no tipo de mídia
        const mediaUrl = getMediaUrl(mediaData, mediaType);
        const description = item.data[0].description;
        const title = item.data[0].title;

//cria o elemento de album (imagens ou vídeos) e adiciona ao container
        const albumContainer = createAlbumContainer(mediaType, mediaUrl, description, title);
        imagesContainer.appendChild(albumContainer);
        }
    } catch (error) {   
        console.error("Erro ao buscar dados na API", error);       
    }
}

//função para validar a resposta da busca
function isValidData(data) {
    return data && data.collection && data.collection.items && data.collection.items.length > 0;
}

//função para pegar o URL correto da mídia (imagem ou vídeos) com base no tipo de mídia
function getMediaUrl(mediaData, mediaType) {
    if(mediaType === "image") {
        return findImageMediaUrl(mediaData); //encontra a URL correta da imagem 
        } else if(mediaType === "video") {
            return findVideoMediaUrl(mediaData); //encontra a URL correta do vídeo
    }
}

//função para encontrar a URL do vídeo (buscar .mp4)
function findVideoMediaUrl(mediaData) {
    for (const mediaUrl of mediaData) {
        if (mediaUrl.endsWith(".mp4")) {
        return mediaUrl;
        }
    }
}

//função para criar o elemento de album (imagens ou vídeos) e adicionar ao container
function createAlbumContainer(mediaType, mediaUrl, description, title) {
    const albumContainer = document.createElement("div");
    albumContainer.classList.add("album");
    if(mediaType === "image") {
    //cria o elemento de imagem e adiciona o evento de clique para abrir o modal
        const imageElement = createImageElement(mediaUrl, description);
        albumContainer.appendChild(imageElement);
    } else if(mediaType === "video") {
        //cria o elemento de vídeo
        const videoElement = createVideoElement(mediaUrl);
        albumContainer.appendChild(videoElement);
    }
    return albumContainer;
}

//função para criar o elemento de imagem e adicionar o evento de clique para abrir o modal
function createImageElement(mediaUrl, description){
    const imageElement = document.createElement("img");
    imageElement.src = mediaUrl;
    imageElement.alt = description;
    imageElement.addEventListener("click", () => openModal(mediaUrl, description));
    return imageElement;
}

//função para criar o elemento de vídeo
function createVideoElement(mediaUrl) {
    const videoElement = document.createElement("video");
    videoElement.controls = true;
    const sourceElement = document.createElement("source");
    sourceElement.src = mediaUrl;   
    sourceElement.type = "video/mp4";
    videoElement.appendChild(sourceElement);
    return videoElement;
}

//função para encontrar URL apropriada (descartar .tif e buscar .jpg ou .png)
function findImageMediaUrl(mediaData){
    for(const mediaUrl of mediaData){
        if(mediaUrl.endsWith(".jpg") || mediaUrl.endsWith(".png")){
        return mediaUrl;
        }
    }
}

//função para abrir o modal com a imagem completa e a descrição
function openModal(mediaUrl, description) {
    const modalContainer = document.getElementById("modal-container");   
    const modalImage = document.getElementById("modal-image");   
    const modalDescription = document.getElementById("modal-description");
 
    modalDescription.textContent = description;
    modalImage.src = mediaUrl;
    modalContainer.style.display = "flex";
}

//função para fechar o modal
function closeModal() {
    const modalContainer = document.getElementById("modal-container");
    modalContainer.style.display = "none";
}
//clique no botão de busca
function handleSearch() {
    const searchInput = document.getElementById("search-input");
    const searchQuery = searchInput.value.trim();
    if(searchQuery !== ""){
        fetchMediaFromNasa(searchQuery);        
    }
}
// Função de busca ao pressionar o botão ou Enter
function handleSearch() {
    const searchInput = document.getElementById("search-input");
    const searchQuery = searchInput.value.trim();
    if (searchQuery !== "") {
        fetchMediaFromNasa(searchQuery);        
    }
}

// Clique no botão de busca
document.getElementById("search-button").addEventListener("click", handleSearch);

// Ativação da busca ao pressionar "Enter" no campo de pesquisa
document.getElementById("search-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

// Função para fechar o modal
function closeModal() {
    const modalContainer = document.getElementById("modal-container");
    modalContainer.style.display = "none";
}

// Evento para fechar o modal ao pressionar "Esc"
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") { // Verifica se a tecla pressionada é "Esc"
        closeModal();
    }
});

//ouvinte do botão de busca
document.getElementById("search-button").addEventListener("click", handleSearch);
