// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./struct/PaymentInformation.sol";

contract BankTransaction {
    IERC20 public tokenAddress; 

    uint256 private currentReceiptIdentifier = 0;
    mapping(address => PaymentInformation[]) private _accountReceipts;
    mapping(uint256 => PaymentInformation) private _paymentInformationByReceiptIdentifier;

    constructor(address _tokenERC20Address) {
        require(_tokenERC20Address != address(0), "The token Address shouldn't be equal the zero-address.");
        tokenAddress = IERC20(_tokenERC20Address);
    }

    function createNewTransaction(address _receiverIdentifier, uint256 _amount, string memory _note) public getNewReceiptIdentifier {
        PaymentInformation memory paymentInfo = PaymentInformation({
            receiptIdentifier: currentReceiptIdentifier,
            senderIdentifier: msg.sender,
            receiverIdentifier: _receiverIdentifier,
            amountOfPayment: _amount,
            timeTransactionValidated: block.timestamp,
            noteTransaction: _note,
            hashReceipt: hash(msg.sender, _receiverIdentifier, _amount)
        });

        _accountReceipts[msg.sender].push(paymentInfo);
        _paymentInformationByReceiptIdentifier[currentReceiptIdentifier] = paymentInfo;
    }

    function getPaymentInformationByReceiptIdentifier(uint256 _receiptIdentifier) external view returns (PaymentInformation memory) {
        require(_receiptIdentifier > 0, "The _receiptIdentifier should be more than zero.");
        return _paymentInformationByReceiptIdentifier[_receiptIdentifier];
    }

    function getMyPaymentInformationList() external view returns (PaymentInformation[] memory _listReceipts) {
        return _accountReceipts[msg.sender];
    }

    function getMyPaymentTransactionCount() public view returns (uint256) {
        return _accountReceipts[msg.sender].length;
    }

    function hash(address _first, address _second, uint256 _amount) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_first, _second, _amount));
    }

    modifier getNewReceiptIdentifier() {
        currentReceiptIdentifier++;
        _;
    }
}
