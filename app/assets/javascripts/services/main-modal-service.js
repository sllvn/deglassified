angular.module('service.main-modal', [])

.service('mainModalService', function($modal, $state) {
    var mainModal = $('#mainModal');
    var isModalOpen;

    // After modal is closed, invoke callback
    $(document).on('closed', '[data-reveal]', closedModalCallback);

    function closedModalCallback() {
        isModalOpen = false;
        $state.go('home');
    }

    function openModal() {
        if (!isModalOpen) {
            mainModal.foundation('reveal', 'open');
            isModalOpen = true;
        }
    }

    return {
        openModal: openModal
    };
})

;
