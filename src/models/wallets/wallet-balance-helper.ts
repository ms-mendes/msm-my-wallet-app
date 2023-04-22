// This module will be called directly by "wallets.ts" everytime a wallet's initial balance is updated

import { GenericModelCRUD } from "../../classes/MongooseModelCRUD"
import { Transaction } from "../transactions/transaction"

export { recalculateWalletBalance }

async function recalculateWalletBalance(walletId: string, initialBalance: number): Promise<number> {
    const transactionsCrud = new GenericModelCRUD(Transaction)
    
    const transactions = await transactionsCrud.findDocuments({ fromWallet: walletId })
    let walletBalance = initialBalance
    
    transactions.forEach(transaction => {
        (transaction.creditValue > 0) ? walletBalance += transaction.creditValue : walletBalance -= transaction.debitValue
    })

    return walletBalance
}