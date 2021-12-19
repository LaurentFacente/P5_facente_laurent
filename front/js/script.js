fetch('http://localhost:3000/api/products') // Appel feetch a l'API pour recuperer les produits qui nous renvoi une promesse
    .then(function (reponse) {
        return reponse.json(); //On formate la reponse en json pour pouvoir l'exploiter
    })
    .then(function (products) {
        // On recupere le resultat de la promesse precedente (products)
        console.log(products);
        //On crée une boucle for pour parcourir les données du tableau et les inserer dans le HTML dynamiquement avec innerHTML
        //A chaque tour de bouche on vient completer le HTML avec les informations a l'index correspondant
        for (let product of products) {
            document.getElementById(
                'items'// On selectionne l'ID items dans le HTML
            ).innerHTML += `<a href="./product.html?id=${product._id}"> 
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`;
        }
    })
    //Si la promesse n'est pas resolut on affiche ici un message d'erreur
    .catch(function (err) {
        alert("Impossible d'afficher les produits");
        console.log(err);
    });


