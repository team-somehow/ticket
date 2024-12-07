#[starknet::interface]
trait ICounter<TCounterState> {
    fn get_counter(self: @TCounterState) -> u32;
    fn increase_counter(ref self: TCounterState, value: u32);
}

pub mod ticket_protocol {

    // Only owner can add scores and withdraw
    use openzeppelin::access::ownable::ownable::OwnableComponent::InternalTrait;
    use openzeppelin::access::ownable::OwnableComponent;

    // for nft
    use openzeppelin_introspection::src5::SRC5Component;
    use openzeppelin_token::erc721::{ERC721Component, ERC721HooksEmptyImpl};


    // 
    use starknet::{get_caller_address, ContractAddress};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;


    #[storage]
    struct Storage {
         #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage
    }

    fn constructor(
        ref self: ContractState,
        recipient: ContractAddress
    ) {
        let name = "Coldplay India Tour";
        let symbol = "CIT";
        let base_uri = "https://api.example.com/v1/";
        let token_id = 1;

        self.erc721.initializer(name, symbol, base_uri);
        self.erc721.mint(recipient, token_id);
    }


}