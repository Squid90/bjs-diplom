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

moneyManager.addMoneyCallback = (data) => ApiConnector.addMoney(data, () =>
    {
        if(data.currency === "" || data.amount === "") {
            //moneyManager.setMessage(isSuccess, message);
        } else {
            ApiConnector.current((user) => ProfileWidget.showProfile(user.data));
            //location.reload(); При первом нажатии на кнопку выдает ошибку и данные в профиле не отображаются.
            //При повторном нажатии страниа нормально обновляется и се даные отображаются корректно.
        }
    }
);

moneyManager.conversionMoneyCallback = (data) => ApiConnector.convertMoney(data, () =>
    {
        if(data.fromAmount === "" || data.fromCurrency === "" || data.targetCurrency === "") {
            //moneyManager.setMessage(isSuccess, message);
        } else {
            ApiConnector.current((user) => ProfileWidget.showProfile(user.data));
            //location.reload();
        }
    }
);


moneyManager.sendMoneyCallback = (data) => ApiConnector.transferMoney(data, () =>
    {
        if(data.amount === "" || data.currency === "" || data.to === "") {
            //moneyManager.setMessage(isSuccess, message);
        } else {
            ApiConnector.current((user) => ProfileWidget.showProfile(user.data));
            //location.reload();
        }
    }
);


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


favoritesWidget.addUserCallback = (data) => ApiConnector.addUserToFavorites(data, () => 
    {
        if(data.id === "" || data.name === "") {
            //favoritesWidget.favoritesMessageBox.setMessage(isSuccess, message);
        } else {
            ApiConnector.getFavorites((favorites) =>
                {
                    favoritesWidget.clearTable();
                    favoritesWidget.fillTable(favorites.data)
                    moneyManager.updateUsersList(favorites.data);
                }
            )
        }
    } 
);


favoritesWidget.removeUserCallback = (data) => ApiConnector.removeUserFromFavorites(data, () =>
    {
        ApiConnector.getFavorites((favorites) =>
            {
                favoritesWidget.clearTable();
                favoritesWidget.fillTable(favorites.data)
                moneyManager.updateUsersList(favorites.data);
            }
        )
    }
);
