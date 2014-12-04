var range = require('../'),
    chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

describe('Parse range from a string',function(){
  var str1 = '-1,-2,-3,-4,0,1,2',
      str2 = '-5~-3, -4, 2, 7',
      str3 = '-3~-10, 10~3',
      str4 = 'abc~232,a,b,c',
      str5 = '~100, 150~',
      str6 = '--10~20,30, ,,,-,~, 5-, -9'
  ;

  function validArray(rng, min, max){
    expect(rng).to.be.an('array');
    expect(rng[0]).to.eql(min);
    expect(rng[1]).to.eql(max);
  }
  describe(str1, function(){
    it('numbers should be wrapped into one array', function(){
      var rng = range.parse(str1);
      should.exist(rng);
      expect(rng.length).to.eql(1);
      validArray(rng[0], -4, 2);
    })
  });

  describe(str2, function(){
    it('should be parsed into one array and two numbers', function(){
      var rng = range.parse(str2);
      should.exist(rng);
      expect(rng.length).to.eql(3);
      validArray(rng[0], -5, -3);
      expect(rng[1]).to.eql(2);
      expect(rng[2]).to.eql(7);
    })
  });

  describe(str4, function(){
    it('an exception should be caught', function(){
      try {
        var rng = range.parse(str4);
      }catch(ex){
        should.exist(ex);
      }
    })
  });

  describe(str5, function(){
    it('maximum and maximum should be filled up', function(){
      var rng = range.parse(str5);
      should.exist(rng);
      expect(rng.length).to.eql(2);
      validArray(rng[0], Number.MIN_VALUE, 100);
      validArray(rng[1], 150, Number.MAX_VALUE);
    })
  });

  describe(str6, function(){
    it('useless chars should be removed', function(){
      var rng = range.parse(str6);
      should.exist(rng);
      expect(rng.length).to.eql(2);
      expect(rng[0]).to.eql(-9);
      expect(rng[1]).to.eql(30);
    })
  });
});