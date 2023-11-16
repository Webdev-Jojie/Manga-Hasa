document.getElementById('generate').addEventListener("click", async function () {
    let offset = document.getElementById("offset").value;
    let limit = document.getElementById("limit").value;
    let contentContainer = document.getElementById('content-container');
    contentContainer.style.marginTop = '10px';

    try {
        let response = await fetch(`https://api.mangadex.org/cover?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        let mangaCoverImg = document.getElementById('mangalist');
        mangaCoverImg.innerHTML = '';

        for (const info of data.data) {
            try {
                let mangaResponse = await fetch(`https://api.mangadex.org/manga/${info.relationships[0].id}?includes%5B%5D=manga`);
                if (!mangaResponse.ok) {
                    throw new Error(`HTTP error! Status: ${mangaResponse.status}`);
                }

                let mangaData = await mangaResponse.json();
                let mangaDescription = mangaData.data.attributes.description.en;
                let mangaTitle = mangaData.data.attributes.title.en;

                let mangaContent = createMangaContent(mangaTitle);
                mangaCoverImg.appendChild(mangaContent);

                let imgcon = createDiv('imgcon');
                let contain = createDiv('description');
                mangaContent.appendChild(imgcon);
                mangaContent.appendChild(contain);

                let mangaTitleElement = document.createElement('h1');
                mangaTitleElement.textContent = mangaTitle;
                document.getElementById('modalTitle').appendChild(mangaTitleElement);

                let mangaTitled = createDiv('title', mangaTitle);
                contain.appendChild(mangaTitled);

                let descript = createParagraph(mangaDescription);
                contain.appendChild(descript);

                let coverImg = createCoverImage(info);
                imgcon.appendChild(coverImg);
                descript.style.display = 'none';

                coverImg.addEventListener('click', function () {
                    showDetailsModal(coverImg.src, mangaTitle, mangaDescription);
                });

            } catch (error) {
                console.error("Error fetching manga data:", error);
            }
        }
    } catch (error) {
        console.error("Error fetching cover data:", error);
    }
});

function createMangaContent(title) {
    let mangaContent = document.createElement('div');
    mangaContent.className = "mangaContent";
    return mangaContent;
}

function createDiv(className, textContent) {
    let div = document.createElement('div');
    div.className = className;
    if (textContent) {
        div.textContent = textContent;
    }
    return div;
}

function createParagraph(textContent) {
    let p = document.createElement('p');
    p.textContent = textContent;
    return p;
}

function createCoverImage(info) {
    let coverImg = document.createElement('img');
    let mangaFilename = info.attributes.fileName;
    let mangaID = info.relationships[0].id;
    coverImg.src = `https://uploads.mangadex.org/covers/${mangaID}/${mangaFilename}`;
    return coverImg;
}

function showDetailsModal(coverImgSrc, title, description) {
    let modal = document.getElementById('modal');
    let modalCoverImg = document.getElementById('modalCoverImg');
    let descriptionContainer = document.getElementById('descriptionContainer');
    let modalTitle = document.getElementById('modalTitle');

    modalCoverImg.src = coverImgSrc;
    modalTitle.textContent = title;
    descriptionContainer.innerHTML = description;
  
    modal.style.display = 'flex';
}

document.getElementById('closeBtn').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target === document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
});
