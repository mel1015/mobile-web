/* 장소 스키마 선언 */

//strict 모드 선언 : 엄격한 문법 검사 키워드
'use strict';

/* mongoose, Schema 모듈 참조 */
var mongoose = require('mongoose');


// 스키마 정의
var placeSchema = mongoose.Schema({
    name: {type: String, index: 'hashed', 'default': ''},
    address: {type: String, 'default': ''},
    tel: {type: String, 'default': ''},
    geometry: {//위치정보
        'type': {type: String, 'default': "Point"},//점 좌표갑
        coordinates: [{type: "Number"}]//여러개의 좌표값을 넣을 수 있도록 배열로 선언
    },
    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
});

placeSchema.index({geometry:'2dsphere'});

/* 필수 속성 required validation
   - 스키마 객체의 path 메서드를 호출하여 필수 속성 컬럼을 지정한 후 required() 메서드를 호출하여
    필수 입력 컬럼으로 만든다.
   - 필수 속성을 입력하지 않으면  'Article title cannot be blank'라는 오류 메시지 전달함
*/
placeSchema.path('name').required(true, 'Article title cannot be blank');
placeSchema.path('address').required(true, 'Article body cannot be blank');
placeSchema.path('tel').required(true, 'Article body cannot be blank');

/*   model 생성
   - model() 메소드에 문자열과 schema를 전달하여 model을 생성한다.
   - model은 보통 대문자로 시작한다.
   - model('collection', 스키마)
   - 모델을 만들면 몽고 DB에 'students'라는 컬렉션이 자동으로 생성됨
     (collection 이름을 자동으로 소문자로 바꾸고 끝에 s를 붙임)
*/
var Place = mongoose.model("place", placeSchema);
module.exports = Place;
