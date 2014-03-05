angular.module('state.modal', [
    'service.main-modal',
    'state.modal.login'
])

.config(function($stateProvider) {
    $stateProvider.state('modal', {
        abstract: true,
        controller: 'loginCtrl',
        onEnter: function(mainModalService) {
            console.log('modal');
            mainModalService.openModal();
        }
    }); 
})

;
