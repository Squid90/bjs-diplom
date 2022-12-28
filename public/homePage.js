'use strict';

const logoutButton = new LogoutButton();

logoutButton.action = () => ApiConnector.logout((response) => 
    { 
        if(response.success) {
            location.reload();
        }
    }
);

ApiConnector.current((user) => 
    {
        if(user.success) {
            ProfileWidget.showProfile(user.data);
        }
    }
);

const ratesBoard = new RatesBoard();

function resetRates() {
    ApiConnector.getStocks((rates) =>
        {
            if(rates.success) {
                ratesBoard.clearTable();
                ratesBoard.fillTable(rates.data);
            }
        }
    )
}

resetRates();
setInterval(() => resetRates(), 60000);


const moneyManager = new MoneyManager();

// moneyManager.addMoneyCallback = addMoneyRequest(dataAdd);

// function addMoneyRequest(dataAdd) {
//     ApiConnector.addMoney(dataAdd, (f) => console.log(f));
// }

// moneyManager.conversionMoneyCallback = conversionMoney(dataConversion);

// function conversionMoney(dataConversion) {
//     ApiConnector.convertMoney(dataConversion, (f) => console.log(f));
// }

// moneyManager.sendMoneyCallback = sendMoney(dataSend);

// function sendMoney(dataSend) {
//     ApiConnector.transferMoney(dataSend, (f) => console.log(f));
// }



const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((favorites) =>
    {
        if(favorites.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(favorites.data);
            moneyManager.updateUsersList(favorites.data);
        }
    } 
);


favoritesWidget.addUserCallback = (dataAddUser) => addFavoriteUser(dataAddUser);

function addFavoriteUser(dataAddUser) {
    ApiConnector.addUserToFavorites(dataAddUser, () => 
        {
            if(dataAddUser === undefined) {
                // favoritesWidget.setMessage(isSuccess, message);
            } else {
                favoritesWidget.clearTable();
                favoritesWidget.fillTable(dataAddUser);
                moneyManager.updateUsersList(dataAddUser);

                // favoritesWidget.setMessage(isSuccess, message);
            }
        }
    )
}