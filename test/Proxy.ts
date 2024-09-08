import { ethers } from "hardhat";
import { L1, L1__factory, L2, Proxy, ProxyAdmin, ProxyAdmin__factory } from "../typechain-types"
import { L2__factory, Proxy__factory } from "../typechain-types/factories/contracts/Proxy.sol";

import {expect} from 'chai'

describe("Deployment", function (){
    let implementation : L1 |L2 , proxy : Proxy, implementationUpgraded : L2, proxyAdmin :ProxyAdmin ;
    let owner : any, user1 : any, user2 : any, user3 : any, users : any;

    
    
    this.beforeAll(async function(){
        [owner, user1, user2, user3, ...users] = await ethers.getSigners();
        implementation = await new L1__factory(owner).deploy();
        let callDataEncoded = implementation.interface.encodeFunctionData("initialize");
        proxy = (await (new Proxy__factory(owner).deploy(implementation.getAddress(), owner.getAddress(), callDataEncoded))) as Proxy;
        
        console.log( await proxy.connect(owner).getProxyAdminAddress(), "admin address here")
        implementation = implementation.attach(await proxy.getAddress()) as L1;
        proxyAdmin = await new ProxyAdmin__factory(owner).attach( await proxy.connect(owner).getProxyAdminAddress());


    } )

    it("should create a proxy intace", async function (){
        const result = await implementation.val();
        expect(result).to.be.equals("hare krishnaa a")
    })

    it("should create second instance with same value", async function (){
        implementationUpgraded = await new L2__factory(owner).deploy();
        // let callData = implementationUpgraded.interface.encodeFunctionData("initialize");
        // console.log(await proxyAdmin.owner(), await proxyAdmin.getAddress(), proxyAdmin , owner);

        await proxyAdmin.upgradeAndCall(await proxy.getAddress() ,await implementationUpgraded.getAddress(), "0x");
        
        implementation = await  implementationUpgraded.attach(await proxy.getAddress()) as L2;

        let result = await implementation.val();
        expect(result).to.be.equals("hare krishnaa a");
    })
    
    it("should use latest functionality from the code", async function (){
        await implementation.setValue("Hari");
        let result = await implementation.val();
        expect(result).to.be.equals("Hari");
    })


})