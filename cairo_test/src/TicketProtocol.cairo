#[starknet::interface]
trait ICounter<TCounterState> {
    fn get_counter(self: @TCounterState) -> u32;
    fn increase_counter(ref self: TCounterState, value: u32);
}

pub mod ticket_protocol {

    use core::starknet::event::EventEmitter;
    use starknet::{get_caller_address, ContractAddress};
    use kill_switch::{IKillSwitchDispatcher, IKillSwitchDispatcherTrait};

    use openzeppelin_introspection::src5::SRC5Component;
    use openzeppelin_token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use starknet::ContractAddress;

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

}