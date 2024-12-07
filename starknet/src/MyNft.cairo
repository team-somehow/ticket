#[starknet::contract]
mod TicketProtocol {
    use openzeppelin_introspection::src5::SRC5Component;
    use openzeppelin_token::erc721::{ERC721Component, ERC721HooksEmptyImpl};

    // use starknet::{get_caller_address, ContractAddress};
    use starknet::get_caller_address;
    use core::array::Array;
    use core::string;
    // use starknet::syscalls::transfer;


    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        pub totalTickets: u32,
        pub stake_amount: u128,  
        // pub applicants_list: Array<ContractAddress>,          
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        total_no_tickets: u32,
        // recipient: ContractAddress
    ) {
        let name = "Coldplay Ticket";
        let symbol = "CT";
        let base_uri = "https://api.example.com/v1/";
        let token_id = 1;
        let recipient = get_caller_address();

        self.totalTickets.write(total_no_tickets);

        self.erc721.initializer(name, symbol, base_uri);
        self.erc721.mint(recipient, token_id);
    }

    fn stake_and_apply(ref self: ContractState, sent_amount: u128) {
        
        // Read the stake amount required
        let required_stake = self.stake_amount.read();
        assert(sent_amount >= required_stake, 'Insufficient staking amount');
    }

    fn transfer_funds(
        // recipient: ContractAddress,
        amount: u256,
    ) {
        // Perform the fund transfer
        // let result = transfer(recipient, amount);

        // Revert if the transfer failed
        // assert(result == 1, "Transfer failed");
    }

}