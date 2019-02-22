var assert = require('assert');

describe( 'module uikitUtility', 
    function() 
    {
        var myUtil = new uikitUtility();

        it( 'should not be null', 
            function() 
            {
                var myUtil = typeof myValue;
                assert(myUtil != null);
            }
        );

        describe('uikitGUID uikitUtility.guid()', 
            function() 
            {
                var myFunc = myUtil.guid;
                it( 'should not be null', 
                    function() 
                    {
                        assert(myFunc != null);
                    }
                );
            
                it( 'should be of type Function', 
                    function() 
                    {
                        var myType = typeof myFunc;
                        assert.equal(myType.toLowerCase(), "function");
                    }
                );
            
                var myGUID = myFunc();
                
                it( 'should not return null', 
                    function() 
                    {
                        assert(myGUID != null);
                    }
                );

            
                it( 'should return a uikitGUID object', 
                    function() 
                    {
                        var myType = myGUID.constructor.name;
                        assert.equal(myType, "uikitGUID");
                    }
                );
            
                it( 'should be have a valid value and status', 
                    function() 
                    {
                        
                        var myValue = myGUID.value;
                        var myStatus = myGUID.status;
                        
                        assert(
                            myStatus        == enums.status.INITIALISED &&
                            myValue.length  == 36
                        );
                    }
                );
            }
        ); // End Describe uikitGUID uikitUtility.guid()
    
    
    
        describe('class uikitGUID', 
            function() 
            {
                var myGUID = new uikitGUID();

                it( '\t should not be null', 
                    function() 
                    {
                        var myType = typeof myValue;
                        assert(myGUID != null);
                    }
                );

                describe('.value', 
                    function() 
                    {
                        var myValue = myGUID.value;

                        it('should not be null', 
                            function() 
                            {
                                assert(myValue != null)
                            }
                        );

                        it('should be of type String', 
                            function() 
                            {
                                var myType = typeof myValue;
                                assert.equal(myType.toLowerCase(), "string");
                            }
                        );

                        it('should be 36 characters long', 

                            function() 
                            {
                                assert(myValue.length == 36);
                            }
                        );

                        it('should be comprised of five blocks of characters separated by dashes', 
                            function() 
                            {
                                var myBlocks = myValue.split('-');
                                assert(myBlocks.length == 5);
                            }
                        );
                    }
                ); // End Describe .value

                describe('.status', 
                    function() 
                    {
                        var myStatus = myGUID.status;

                        it('should not be null', 
                            function() 
                            {
                                assert(myStatus != null)
                            }
                        );

                        it('should be of type number', 
                            function() 
                            {
                                var myType = typeof myStatus;
                                assert.equal(myType.toLowerCase(), "number");
                            }
                        );

                        it('should be equal to enums.status.INITIALISED', 
                            function() 
                            {
                                assert.equal(myStatus, enums.status.INITIALISED);
                            }
                        );
                    }
                ); // End Describe .status
            
            }
        ); // End Describe class uikitGUID
    }
); // End Describe module uikitUtility