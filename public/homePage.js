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
moneyManager.addMoneyCallback = (data) => ApiConnector.addMoney(data, (response) =>
    {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
        }
        moneyManager.setMessage(response.success, response.error || "Зачисление выполнено успешно");
    }
);

moneyManager.conversionMoneyCallback = (data) => ApiConnector.convertMoney(data, (response) =>
    {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
        }
        moneyManager.setMessage(response.success, response.error || "Конвертация выполнена успешно");
    }
);


moneyManager.sendMoneyCallback = (data) => ApiConnector.transferMoney(data, (response) =>
    {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
        }
        moneyManager.setMessage(response.success, response.error || "Перевод выполнен успешно");      
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


favoritesWidget.addUserCallback = (data) => ApiConnector.addUserToFavorites(data, (response) => 
    {
        if(response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
        favoritesWidget.setMessage(response.success, response.error || "Пользователь добавлен");
    } 
);


favoritesWidget.removeUserCallback = (data) => ApiConnector.removeUserFromFavorites(data, (response) =>
    {
        if(response.success){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        } 
        favoritesWidget.setMessage(response.success, response.error || "Пользователь удален");
    }
);
