// Grammar rules
// [FHIRPath](http://hl7.org/fhirpath/N1) Normative Release

//prog: line (line)*;
//line: ID ( '(' expr ')') ':' expr '\r'? '\n';

expression
        = additive_operation WS
        // ('+' / '-') init                                         // polarity expression
        /// (IDENTIFIER)? '=>' expression                           //lambdaExpression

non_op = term expression_inner

equality_operation = additive_operation ('<=' / '<' / '>' / '>=' / '=' / '~' / '!=' / '!~') WS additive_operation
                   / additive_operation

additive_operation = rh:multiplication_operation WS ('+' / '-' / '&') WS multiplication_operation 
                   / multiplication_operation

multiplication_operation = rh:union_operation WS lh:(('*' / '/' / 'div' / 'mod') WS union_operation)*

union_operation  = rh:mem_operation WS lh:(("|") WS mem_operation) * 

mem_operation =    rh: and_operation WS lh:(('in' / 'contains') WS and_operation) *

and_operation =    rh:or_operation WS lh:(('and') WS or_operation) *

or_operation =     rh:implies_operation WS lh:(('or' / 'xor') WS implies_operation) *

implies_operation = rh:non_op WS lh:(('implies') WS non_op) *

expression_inner
        = '.' invocation expression_inner ?                      //invocationExpression
        / '[' expression ']' expression_inner ?                  //indexerExpression
       // / expression ('is' / 'as') //typeSpecifier             //typeExpression

term
        = invocation                                            //invocationTerm
        / literal                                               //literalTerm
        / externalConstant                                      //externalConstantTerm
        / '(' expression ')'                                    //parenthesizedTerm
        ;


literal
        = '{' '}'                                                  //nullLiteral
        / ('true' / 'false')                                       //booleanLiteral
        // / STRING                                                //stringLiteral
        // / NUMBER                                                //numberLiteral
        // / DATE                                                  //dateLiteral
        // / DATETIME                                              //dateTimeLiteral
        // / TIME                                                  //timeLiteral
        // / quantity                                              //quantityLiteral

externalConstant
        = '%' (identifier / STRING )
        ;        

invocation                          // Terms that can be used after the function/member invocation '.'
        = $(identifier)                                            //memberInvocation
        // / function                                              //functionInvocation
        // / '$this'                                               //thisInvocation
        // / '$index'                                              //indexInvocation
        / '$total'                                              //totalInvocation        

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
        = '\'' $(ESC / .)* '\''
        ;

IDENTIFIER
        = $([A-Za-z] / '_')([A-Za-z0-9] / '_')*            // Added _ to support CQL (FHIR could constrain it out)
        ;

WS "whitespace"
  = ("\t" / "\r" / "\n" / " ")*