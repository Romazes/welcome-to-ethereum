// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

struct PaymentInformation {
    uint256 receiptIdentifier;
    address senderIdentifier;
    address receiverIdentifier;
    uint256 amountOfPayment;
    uint256 timeTransactionValidated;
    string noteTransaction;
    bytes32 hashReceipt;
}