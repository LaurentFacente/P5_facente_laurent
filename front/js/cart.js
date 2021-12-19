
var produitLocalStorage = JSON.parse(localStorage.getItem("produit")); //Ici on recupere l'array qui contient nos produit dans le local Storage
console.table(produitLocalStorage); //On affiche ce tableau dans la console

function getCart() { //On crée une fonction qui nous permet de d'inserer les elements du panier en parcourant notre tableau grace la une boucle for in
    for (let produit in produitLocalStorage) {
        document.getElementById('cart__items').innerHTML += `<article class="cart__item" data-color="${produitLocalStorage[produit].couleurProduit}" data-id="${produitLocalStorage[produit].idProduit}">
            <div class="cart__item__img">
              <img src="${produitLocalStorage[produit].imgProduit}" alt="${produitLocalStorage[produit].altImgProduit}>
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__titlePrice">
                <h2>${produitLocalStorage[produit].nomProduit}</h2>
                <p>${produitLocalStorage[produit].prixProduit} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produitLocalStorage[produit].quantiteProduit}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`
    }
}
getCart();// On appel la fonction getCart

function getTotals() {

    // Récupération du total des quantités
    var elemsQtt = document.getElementsByClassName('itemQuantity');
    var myLength = elemsQtt.length,
        totalQtt = 0;

    for (var i = 0; i < myLength; ++i) {
        totalQtt += elemsQtt[i].valueAsNumber;
    }

    let productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.innerHTML = totalQtt;
    console.log(totalQtt);

    // Récupération du prix total
    totalPrice = 0;

    for (var i = 0; i < myLength; ++i) {
        totalPrice += (elemsQtt[i].valueAsNumber * produitLocalStorage[i].prixProduit);
    }

    let productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.innerHTML = totalPrice;
    console.log(totalPrice);
}
getTotals();

// Modification d'une quantité de produit
function modifyQtt() {
    let qttModif = document.querySelectorAll(".itemQuantity");

    for (let k = 0; k < qttModif.length; k++) {
        qttModif[k].addEventListener("change", (event) => {
            event.preventDefault();

            //Selection de l'element à modifier en fonction de son id ET sa couleur
            let quantityModif = produitLocalStorage[k].quantiteProduit;
            let qttModifValue = qttModif[k].valueAsNumber;

            const resultFind = produitLocalStorage.find((el) => el.qttModifValue !== quantityModif);

            resultFind.quantiteProduit = qttModifValue;
            produitLocalStorage[k].quantiteProduit = resultFind.quantiteProduit;

            localStorage.setItem("produit", JSON.stringify(produitLocalStorage));

            // refresh rapide
            location.reload();
        })
    }
}
modifyQtt();

// Suppression d'un produit
function deleteProduct() {
    let btn_supprimer = document.querySelectorAll(".deleteItem");

    for (let j = 0; j < btn_supprimer.length; j++) {
        btn_supprimer[j].addEventListener("click", (event) => {
            event.preventDefault();

            //Selection de l'element à supprimer en fonction de son id ET sa couleur
            let idDelete = produitLocalStorage[j].idProduit;
            let colorDelete = produitLocalStorage[j].couleurProduit;

            produitLocalStorage = produitLocalStorage.filter(el => el.idProduit !== idDelete || el.couleurProduit !== colorDelete);

            localStorage.setItem("produit", JSON.stringify(produitLocalStorage));

            //Alerte produit supprimé et refresh
            alert("Ce produit a bien été supprimé du panier");
            location.reload();
        })
    }
}
deleteProduct();

/******************************* vérifier les infos dans le formulaire de commande + requet post api */
//récupération des données du formulaire 
let form = document.querySelector('.cart__order__form');
let firstName = document.querySelector('#firstName');
let lastName = document.querySelector('#lastName');
let address = document.querySelector('#address');
let city = document.querySelector('#city');
let email = document.querySelector('#email');

// fonction pour vérifier les données du formulaire
// prénom 
const firstNameCheck = () => {
    let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
    if (!/^[A-Za-zÀ-ÿ\-' ]+$/gi.test(firstName.value) || firstName.value == "") {
        firstNameErrorMsg.textContent = "Renseignez votre prénom en lettres pour valider votre commande."
        // console.log("le prénom : " + firstName.value + " ne correspond pas au modèle");
        return false;
    } else {
        firstNameErrorMsg.textContent = ""
        return true;
    }
};
// nom
const lastNameCheck = () => {
    let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
    if (!/^[A-Za-zÀ-ÿ\-' ]+$/gi.test(lastName.value) || lastName.value == "") {
        lastNameErrorMsg.textContent = "Renseignez votre nom en lettres pour valider votre commande."
        console.log("le nom : " + lastName.value + " ne correspond pas au modèle");
        return false;
    } else {
        lastNameErrorMsg.textContent = ""
        return true;
    }
};
// adresse
const addressCheck = () => {
    let addressErrorMsg = document.querySelector('#addressErrorMsg');
    if (!/^([A-Za-zÀ-ÿ]|[0-9]{1,4})([A-Za-zÀ-ÿ\-' ]+$)/gi.test(address.value) || address.value == "") {
        addressErrorMsg.textContent = "Renseignez votre addresse pour valider votre commande. Ex : 25 rue du confort"
        console.log("l\'adresse ne correspond pas au modèle");
        return false;
    } else {
        addressErrorMsg.textContent = "";
        return true;
    }
};
// ville
const cityCheck = () => {
    let cityErrorMsg = document.querySelector('#cityErrorMsg');
    if (!/^[A-Za-zÀ-ÿ\-' ]+$/gi.test(city.value) || city.value == "") { // ou cp + ville : /^[0-9]{5} [A-Za-zÀ-ÿ\-' ]+$/gi
        cityErrorMsg.textContent = "Renseignez votre ville en toutes lettres pour valider votre commande."
        console.log("le nom de la ville ne correspond pas au modèle");
        return false;
    } else {
        cityErrorMsg.textContent = "";
        return true;
    }
};
// email
const emailCheck = () => {
    let emailErrorMsg = document.querySelector('#emailErrorMsg');
    if (!/([a-z\.\-]{1,})@([a-z\-\.]{2,})\.([a-z]{2,4})/gi.test(email.value) || email.value == "") {
        emailErrorMsg.textContent = "Renseignez votre email sous le format \"xxxxx@xxxx.xxx\" pour valider votre commande."
        console.log("l\'adresse email ne correspond pas au regex");
        return false;
    } else {
        emailErrorMsg.textContent = "";
        return true;
    }
}

// event listerner : au click si vérifs ok alors envoyer contact + products à api (post)
let orderBtn = document.querySelector('#order');
orderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let contact = {};
    let products = [];

    // vérification des inputs du formulaire
    if (!firstNameCheck() ||
        !lastNameCheck() ||
        !addressCheck() ||
        !cityCheck() ||
        !emailCheck()) {
        e.preventDefault();
        // alert("Veuillez suivre les instructions pour remplir le formulaire correctement.")
    } else {
        console.log("le formulaire est bien rempli")
        // récup valeurs pour objet contact 
        contact = {
            'firstName': firstName.value,
            'lastName': lastName.value,
            'address': address.value,
            'city': city.value,
            'email': email.value,
        }

        // déclaration d'une variable contenant les infos de la commande
        let order = {
            contact,
            products
        }
        console.log(order);

        //requete post api
        fetch("http://localhost:3000/api/products/order", {
            "method": "post",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(order)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(function (value) {
                let orderLink = document.createElement('a');
                orderLink.href = "confirmation.html?id=" + value.orderId;
                console.log(orderLink);
                //redirection vers page confirmation + orderId
                window.location.href = orderLink
            })
            .catch(err => {
                console.error(err);
            });
    }
});
