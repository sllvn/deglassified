angular.module('service.main-modal', [])

.service('mainModalService', function($rootScope, $modal, $state) {
    var mainModal = $('#mainModal');
    var isModalOpen;

    // After modal is closed, invoke callback
    $(document).on('closed', '[data-reveal]', closedModalCallback);

    function closedModalCallback() {
        isModalOpen = false;
        if ($rootScope.currentLocation) {
            $state.go('location', { location: $rootScope.currentLocation.slug });
        } else {
            $state.go('home');
        }
    }

    function openModal() {
        if (!isModalOpen) {
            mainModal.foundation('reveal', 'open');
            isModalOpen = true;
        }
    }

    function closeModal() {
        mainModal.foundation('reveal', 'close');
    }

    return {
        openModal: openModal,
        closeModal: closeModal
    };
})

;
