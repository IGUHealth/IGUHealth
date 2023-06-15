// Grammar rules
// [FHIRPath](http://hl7.org/fhirpath/N1) Normative Release

//prog: line (line)*;
//line: ID ( '(' expr ')') ':' expr '\r'? '\n';

expression
        = term expression_2
        / ('+' / '-') expression //polarityExpression
        
        /// (IDENTIFIER)? '=>' expression                           //lambdaExpression

expression_2
        = '.' invocation expression_2                            //invocationExpression
        / '[' expression ']' expression_2                        //indexerExpression
        / ('*' / '/' / 'div' / 'mod') expression expression_2    //multiplicativeExpression
        / ('+' / '-' / '&') expression  expression_2             //additiveExpression
       // / expression ('is' / 'as') //typeSpecifier             //typeExpression
        /  '/' expression  expression_2                          //unionExpression
        /  ('<=' / '<' / '>' / '>=') expression expression_2     //inequalityExpression
        /  ('=' / '~' / '!=' / '!~') expression expression_2     //equalityExpression
        /  ('in' / 'contains') expression expression_2           //membershipExpression
        /  'and' expression expression_2                         //andExpression
        /  ('or' / 'xor') expression expression_2                //orExpression
        /  'implies' expression expression_2                     //impliesExpression;

term
        = invocation                                            //invocationTerm
        / literal                                               //literalTerm
        / externalConstant                                      //externalConstantTerm
        / '(' expression ')'                                    //parenthesizedTerm
        ;


literal
        = '{' '}'                                               //nullLiteral
        / ('true' / 'false')                                    //booleanLiteral
        // / STRING                                                //stringLiteral
        // / NUMBER                                                //numberLiteral
        // / DATE                                                  //dateLiteral
        // / DATETIME                                              //dateTimeLiteral
        // / TIME                                                  //timeLiteral
        // / quantity                                              //quantityLiteral

externalConstant
        = '%' ( identifier / STRING )
        ;        

invocation                          // Terms that can be used after the function/member invocation '.'
        // = identifier                                            //memberInvocation
        // / function                                              //functionInvocation
        // / '$this'                                               //thisInvocation
        // / '$index'                                              //indexInvocation
        = '$total'                                              //totalInvocation        

identifier
        = IDENTIFIER
        /// DELIMITEDIDENTIFIER
        / 'as'
        / 'contains'
        / 'in'
        / 'is'
        ;        

ESC  = [^\'\"]

STRING
        = '\'' (ESC / .)* '\''
        ;

IDENTIFIER
        = ([A-Za-z] / '_')([A-Za-z0-9] / '_')*            // Added _ to support CQL (FHIR could constrain it out)
        ;