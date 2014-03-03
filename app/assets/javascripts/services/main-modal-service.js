angular.module('service.main-modal', [])

.service('mainModalService', function($modal) {
    var isModalOpen,
        closeModalInstance;

    // Could move this into their own service, like loadModals() or setModals()
    function openModal() {
        if (!isModalOpen) {
            $modal.open({
                templateUrl: '/partials/main-modal.html',
                controller: function($scope, $modalInstance) {
                    closeModalInstance = $modalInstance.close;
                }
            });
            isModalOpen = true;
        }
    }
    
    function closeModal() {
        if (isModalOpen && !!closeModalInstance) {
            closeModalInstance();
            isModalOpen = false;
        } 
    }

    return {
        openModal: openModal,
        closeModal: closeModal
    };
})

;
