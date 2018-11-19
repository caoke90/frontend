import txt from './type.md'
const data=[]
txt.replace(/.+/mg,function (m) {
        m.replace(/(\d+)\s+(\d+)\s+(\S+)/m,function (m2,p1,p2,p3,p4) {
                data.push([parseInt(p1),parseInt(p2),p3])
        })

})
export function getNewContentTypeId(id){
        let item=[];
        for(let i=0;i<data.length;i++){
                if(data[i][1]==id){
                        item=data[i];
                        break;
                }
        }
        return item;
}