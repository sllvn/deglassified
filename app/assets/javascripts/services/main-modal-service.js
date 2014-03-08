angular.module('service.main-modal', [])

.service('mainModalService', function($rootScope, $state) {
    var mainModal = $('#mainModal');
    var isModalOpen,
        skipStateChange;

    // After modal is closed, invoke callback
    $(document).on('closed', '[data-reveal]', closedModalCallback);

    function closedModalCallback() {
        isModalOpen = false;
        if (skipStateChange) {
            skipStateChange = false;
        } else {
            returnToLastState();
        }
    }

    function returnToLastState() {
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

    function closeModalWithoutRedirect() {
        // Will be using specific state change, so skip default state change when modal closes
        skipStateChange = true;
        mainModal.foundation('reveal', 'close');
    }

    return {
        openModal: openModal,
        closeModalWithoutRedirect: closeModalWithoutRedirect
    };
})

;
