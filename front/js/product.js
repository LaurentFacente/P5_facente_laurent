
var params = new URL(document.location).searchParams;//Ici on crée une variable dans laquelle est stocker notre URL selon le produit a afficher
var id = params.get("id"); //On recupere seulement l'id de l'url que l'on stock dans une variable
let product = "";

const colorPicked = document.querySelector("#colors");
const quantityPicked = document.querySelector("#quantity");

console.log(id);//Ici on affiche l'id du produit dans la console

fetch(`http://localhost:3000/api/products/${id}`)// Appel a l'API pour recuperer les infos du produit grace a son ID
    .then(function (reponse) {
        return reponse.json() //Formatage de la reponse en json
    })
    .then(function (product) { //On stock les infos exploitable dans la variable "product"
        console.log(product)
        {   //Insertion des elements dans le HTML grace a la methode getElementById et innerHTML et la concatenation
            document.getElementById('title').innerHTML += `<h1 id="title">${product.name}</h1>`; // Nom du produit
            document.getElementById('price').innerHTML += `<span id="price">${product.price}</span>`; //Prix
            document.getElementById('description').innerHTML += `<p id="description">${product.description}</p>`; // Description
            document.getElementById('colors').innerHTML += `<option value="${product.colors[0]}">${product.colors[0]}</option> 
                                    <option value="${product.colors[1]}">${product.colors[1]}</option>
                                    <option value="${product.colors[2]}">${product.colors[2]}</option>`; //Option de couleurs a l'index correspondant
            //Insertion de l'image du produit et de sa description grace a la methode querySelector(Selecteur CSS)
            document.querySelector('.item__img').innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

        }

        addToCart(product);
    })
    .catch(function (error) { //Si la promesse n'est pas resolut, on affiche une alerte
        alert('Desolé nous ne sommes pas en mesure de vous presenter nos produit, reessayer ulterieurement.');
    });



//Creation de la fonction ajouter au panier
function addToCart(product) {
    const btn_envoyerPanier = document.querySelector("#addToCart"); //Stockage du bouton dans une constante pour pouvoir l'ecouter

    //Ecoute du clic avec 2 conditions : la couleur doit etre choisie et la quantitée doit etre comprise entre 1 et 100
    btn_envoyerPanier.addEventListener("click", function (event) {
        if (quantityPicked.value > 0 && quantityPicked.value <= 100 && quantityPicked.value != 0) {

            let choixCouleur = colorPicked.value; // Stockage du choix de la couleur dans une variable
            let choixQuantite = quantityPicked.value; //Stockage de la quantitée choisiee dans une variable
            let optionsProduit = {
                idProduit: id,
                couleurProduit: choixCouleur,
                quantiteProduit: Number(choixQuantite),
                nomProduit: product.name,
                prixProduit: product.price,
                descriptionProduit: product.description,
                imgProduit: product.imageUrl,
                altImgProduit: product.altTxt
            };
            var produitLocalStorage = JSON.parse(localStorage.getItem("produit")); //variable qui va nous servir a recuperer les données du localstorage

            /*Creation d'une fonction qui va demander au l'utilisateur de confirmé son choix et le rediriger 
            vers la page panier*/
            const confirmationPannier = function () {
                if (window.confirm(`Votre commande de ${choixQuantite} ${product.name} ${choixCouleur} est ajoutée au panier`)) {
                    window.location.href = "cart.html";
                }
            };

            //Importation de la commande dans le LocalStorage
            //Si le panier comporte déjà au moins 1 article
            if (produitLocalStorage) {
                const resultFind = produitLocalStorage.find(  //Si l'id de element et que la couleur selectionné est la meme que la selection actuele alors le produit est deja dans le panier
                    (el) => el.idProduit === id && el.couleurProduit === choixCouleur);

                //Si le produit commandé est déjà dans le panier
                if (resultFind) { //On affecte alors une nouvelle quantité grace a la concatenation entre la quantitée deja presente et la quantité de la selection actuele
                    let newQuantite = parseInt(optionsProduit.quantiteProduit) + parseInt(resultFind.quantiteProduit);
                    resultFind.quantiteProduit = newQuantite;
                    localStorage.setItem("produit", JSON.stringify(produitLocalStorage));//Met a jour le local storage avec nos nouvelles donnée
                    console.table(produitLocalStorage);
                    confirmationPannier();
                    //Si le produit commandé n'est pas dans le panier
                } else {// On ajoute notre commande dans le local storage a la fin du tableau avec la methode .push
                    produitLocalStorage.push(optionsProduit);
                    localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
                    console.table(produitLocalStorage);
                    confirmationPannier();
                }
                //Si le panier est vide
            } else {
                produitLocalStorage = []; //Alors le localStorage contient un tableau vide 
                produitLocalStorage.push(optionsProduit);//On y ajoute option produit dans le tableau produitLocalStorage
                localStorage.setItem("produit", JSON.stringify(produitLocalStorage));//On met a jour le local storage avec notre produit
                console.table(produitLocalStorage);//On l'affiche ici sous forme de tableau dans la console
                confirmationPannier();
            }
        }
    });
}

console.log(localStorage);


