import fetch from "node-fetch";
import { Selector} from "testcafe";

const url = 'http://localhost:5000/devices';

fixture('Ninja Tests').page('http://localhost:3000')
test('Load Devices and validate', async t=>{       
    
    let lsDevice = [];

    await fetch(url).then((response)=>{
            return response.json();
        }
        ).then((value)=>{
           lsDevice = value;
        })        

    const listDevices = Selector('#root')    
    .child('div')
    .child('div')
    .child('div.list-devices-main')
    .child('div')
    .child('div');    

    lsDevice.sort((a,b)=> a.hdd_capacity - b.hdd_capacity);

    for (let i = 0; i < lsDevice.length; i++) {

        var deviceNames = listDevices.nth(i).child('div.device-info').child('span.device-name');
        var deviceTypes = listDevices.nth(i).child('div.device-info').child('span.device-type');
        var deviceCapacity = listDevices.nth(i).child('div.device-info').child('span.device-capacity');
        
        await t    
        .expect(deviceNames.exists).eql(true)
        .expect(deviceNames.visible).eql(true)    
        .expect(deviceNames.textContent).eql(lsDevice[i].system_name);

        await t
        .expect(deviceTypes.exists).eql(true)
        .expect(deviceTypes.visible).eql(true)
        .expect(deviceTypes.textContent).eql(lsDevice[i].type);

        await t
        .expect(deviceCapacity.exists).eql(true)
        .expect(deviceCapacity.visible).eql(true)
        .expect(deviceCapacity.textContent).eql(lsDevice[i].hdd_capacity+' GB');
    }      
}),

test('add Device and validate', async t=>{   

     const addDevice = Selector('#root a').withText('ADD DEVICE')
     const systemName = Selector('#system_name');
     const deviceTypeCombo = Selector("#type");
     const deviceCapacity = Selector('#hdd_capacity');
     const submitDevice = Selector('#root button').withText('SAVE')
     const index = Selector('#root').child('div').child('div').child('div.list-devices-main').child('div').child('div')

     for (let i = 0; i < index; i++) {
        
         const listDevices = Selector('#root')    
         .child('div')
         .child('div')
         .child('div.list-devices-main')
         .child('div')
         .child('div')
         .nth(i)

         if(listDevices.child('div.device-info').child('span.device-name').textContent.eql('TEST-CAFE')){
            await t
            .expect(listDevices.child('div.device-info').child('span.device-name').textContent).eql('TEST-CAFE')
            .expect(listDevices.child('div.device-info').child('span.device-type').textContent).eql('MAC')
            .expect(listDevices.child('div.device-info').child('span.device-capacity').textContent).eql('99 GB')     
         }
     }

     await t
            .click(addDevice)
            .typeText(systemName, 'NINJA-TEST')
            .click(deviceTypeCombo)
            .click(Selector('option').filter('[value="MAC"]'))   
            .typeText(deviceCapacity, '99')
            .click(submitDevice);           
           
            for (let i = 0; i < index; i++) {
        
             const listDevices = Selector('#root')    
             .child('div')
             .child('div')
             .child('div.list-devices-main')
             .child('div')
             .child('div')
             .nth(i)
                        
             if(listDevices.child('div.device-info').child('span.device-name').textContent == 'NINJA-TEST'){
                await t
                .expect(listDevices.child('div.device-info').child('span.device-name').exists).eql(true)
                .expect(listDevices.child('div.device-info').child('span.device-name').visible).eql(true)
                .expect(listDevices.child('div.device-info').child('span.device-name').textContent).eql('NINJA-TEST')
                .expect(listDevices.child('div.device-info').child('span.device-type').exists).eql(true)
                .expect(listDevices.child('div.device-info').child('span.device-type').visible).eql(true)
                .expect(listDevices.child('div.device-info').child('span.device-type').textContent).eql('MAC')
                .expect(listDevices.child('div.device-info').child('span.device-capacity').exists).eql(true)
                .expect(listDevices.child('div.device-info').child('span.device-capacity').visible).eql(true)
                .expect(listDevices.child('div.device-info').child('span.device-capacity').textContent).eql('99 GB')
                .click(Selector('.device-options').nth(2).find('.device-remove'));
             }
         }            
 });
