// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract BankTransaction {

    struct PaymentInformation {
        uint256 receiptIdentifier;

        address senderIdentifier;
        address receiverIdentifier;

        uint256 amountOfPayment;

        uint timeTransactionValidated;
        string noteTransaction;

        string hashReceipt; // need concatenate clientIdentifier + receiverIdentifier +  amountOfPayment + timeTransactionValidated (хеширования полученной строки любым доступным в Solidity алгоритмом.) address(uint256(keccak256(abi.encodePacked(addressA, addressB))))
    }

    uint256 private currentReceiptIdentifier = 0;
    mapping(address => PaymentInformation[]) private _accountReceipts;


/*
Контракт должен содержать следующие функции: добавление нового платежа, 
получение информации о платеже по его идентификатору, получение всех платежей конкретного клиента.
*/
    function createNewTransaction(address _receiverIdentifier, uint256 _amount, string memory _note) public getNewReceiptIdentifier {
        PaymentInformation memory paymentInfo = PaymentInformation({
            receiptIdentifier: currentReceiptIdentifier,
            senderIdentifier: msg.sender,
            receiverIdentifier: _receiverIdentifier,
            amountOfPayment: _amount,
            timeTransactionValidated: block.timestamp,
            noteTransaction: _note,
            hashReceipt: "x"
        });

        _accountReceipts[msg.sender].push(paymentInfo);
    }

    function myDonations() public view returns (PaymentInformation[] memory _listReceipts)
    {
        return _accountReceipts[msg.sender];
    }

    function myDonationsCount() public view returns (uint256) {
        return _accountReceipts[msg.sender].length;
    }



    modifier getNewReceiptIdentifier() {
        currentReceiptIdentifier++;
        _;
    }
}
