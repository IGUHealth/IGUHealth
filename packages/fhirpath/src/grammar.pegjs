// Grammar rules
// [FHIRPath](http://hl7.org/fhirpath/N1) Normative Release

//prog: line (line)*;
//line: ID ( '(' expr ')') ':' expr '\r'? '\n';
{
  function buildBinaryExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return buildNode("Expression", {
        type: "Operation",
        operator: element[0],
        left: result,
        right: element[2]
      });
    }, head);
  }

  function buildNode<T>(type: string, value: T, next){
        let node = {type: type};
        // Value could be false literal
        if (value !== undefined && value !== null) node.value = value
        if (next) node.next = next;
        return node
  }
}

expression
        = WS expression:implies_operation WS
        {return expression}
        // ('+' / '-') init                                         // polarity expression
        /// (IDENTIFIER)? '=>' expression                           //lambdaExpression

_singular_expression = term:term next:expression_inner?
{ return buildNode("Expression", buildNode("Singular", term, next)) }

// #01 . (path/function invocation)
// #02 [] (indexer)
// #03 unary + and -
// #04: *, /, div, mod
// #05: +, -, &
// #06: is, as
// #07: |
// #08: >, <, >=, <=
// #09: =, ~, !=, !~
// #10: in, contains
// #11: and
// #12: xor, or
// #13: implies

implies_operation = head:or_operation WS tail:($('implies') WS or_operation WS) *
{ return buildBinaryExpression(head, tail)}
or_operation =     head:and_operation WS tail:($('or' / 'xor') WS and_operation WS) *
{ return buildBinaryExpression(head, tail)}
and_operation =    head:mem_operation WS tail:($('and') WS mem_operation WS) *
{ return buildBinaryExpression(head, tail)}
mem_operation =    head: equality_operation WS tail:($('in' / 'contains') WS equality_operation WS) *
{ return buildBinaryExpression(head, tail)}
equality_operation = head:union_operation WS tail:($('<=' / '<' / '>' / '>=' / '=' / '~' / '!=' / '!~') WS union_operation WS) *
{ return buildBinaryExpression(head, tail)}
union_operation  = head:is_as_operation WS tail:($("|") WS is_as_operation WS) * 
{ return buildBinaryExpression(head, tail)}
is_as_operation  = head:additive_operation WS tail:($("is" / "as") WS additive_operation WS) * 
{ return buildBinaryExpression(head, tail)}
additive_operation = head:multiplication_operation WS tail:($('+' / '-' / '&') WS multiplication_operation WS)*
{ return buildBinaryExpression(head, tail)}
multiplication_operation = head:_singular_expression WS tail:($('*' / '/' / 'div' / 'mod') WS _singular_expression WS)*
{ return buildBinaryExpression(head, tail)}




expression_inner
        = invocation_expression
        / indexed_expression

invocation_expression
      = '.' invocation:invocation next:(expression_inner)*    //invocationExpression
{ return [invocation, ...next.flat()]; }

indexed_expression
        = '[' expression:(expression) ']' next:(expression_inner)*                   //indexerExpression
{ return [buildNode("Indexed", expression), ...next.flat()] }

term
        = literal                                               //literalTerm
        / invocation                                            //invocationTerm
        / externalConstant                                      //externalConstantTerm
        / '(' expression:expression ')' {return expression}     //parenthesizedTerm
        ;


literal
        = 
        value:(
                '{' '}' {return null}                                 //nullLiteral
                / bool:$('true' / 'false') {return bool === "true"}     //booleanLiteral
                / STRING                                                //stringLiteral
                / num:NUMBER   {return Number(num)}                     //numberLiteral
                / DATETIME                                              //dateTimeLiteral
                / DATE                                                  //dateLiteral
                / TIME                                                  //timeLiteral
                / quantity                                              //quantityLiteral
        )
        {return buildNode("Literal", value)}

NUMBER = $([0-9]+('.' [0-9]+)?)

externalConstant
        = '%' variable:(identifier / STRING)                              //externalConstant
        {return buildNode("Variable", variable)}

invocation                          // Terms that can be used after the function/member invocation '.'
        = invocation:(function                               //functionInvocation
        / identifier                             //identifierInvocation
        / '$this'    {return buildNode("This")}  //thisInvocation
        / '$index'   {return buildNode("Index")} //indexInvocation
        / '$total'   {return buildNode("Total")} //totalInvocation        
        )
        {return buildNode("Invocation", invocation)}

function
        = identifier:identifier '(' paramList:paramList? ')'
        {return buildNode("Function", identifier, paramList || [])}
        ;

paramList
        = WS head:expression WS tail:(',' WS expression)*
        {return [head].concat(tail.map(function(element) {return element[2]}))}
        ;

quantity
        = value:NUMBER WS unit:unit? { return {value:value, unit:unit}}

unit
        = dateTimePrecision
        / pluralDateTimePrecision
        / STRING // UCUM syntax for units of measure 

dateTimePrecision
        = $('year' / 'month' / 'week' / 'day' / 'hour' / 'minute' / 'second' / 'millisecond')
        ;

pluralDateTimePrecision
        = $('years' / 'months' / 'weeks' / 'days' / 'hours' / 'minutes' / 'seconds' / 'milliseconds')

identifier
        = identifier:IDENTIFIER {return buildNode("Identifier", identifier)} //identifier
         / identifier:DELIMITEDIDENTIFIER {return buildNode("Identifier", identifier)} //identifier


DATE = '@' date:DATEFORMAT { return date }

DATETIME = '@' datetime:$(DATEFORMAT 'T' (TIMEFORMAT TIMEZONEOFFSETFORMAT?)?) {return datetime}

TIME = '@' 'T' time:TIMEFORMAT { return time }

DATEFORMAT = 
         $([0-9][0-9][0-9][0-9] ('-'[0-9][0-9] ('-'[0-9][0-9])?)?)

TIMEFORMAT =
        $(([0-9][0-9] (':'[0-9][0-9] (':'[0-9][0-9] ('.'[0-9]+)?)?)?))

TIMEZONEOFFSETFORMAT
        = $(('Z' / ('+' / '-') [0-9][0-9]':'[0-9][0-9]))

IDENTIFIER
        = $(([A-Za-z] / '_')([A-Za-z0-9] / '_')*)            // Added _ to support CQL (FHIR could constrain it out)

DELIMITEDIDENTIFIER  
        = '`' id:$(([^\`])*) '`' {return id}

//ESC  = [^\'\"\`]

STRING
        = '\'' str:$(([^\'])*) '\''    {return str}                             //singleQuotedString

WS "whitespace"
  = ("\t" / "\r" / "\n" / " ")*


//   COMMENT
//         : '/*' .*? '*/' -> channel(HIDDEN)
//         ;

// LINE_COMMENT
//         : '//' ~[\r\n]* -> channel(HIDDEN)
//         ;

// fragment ESC
//         : '\\' ([`'\\/fnrt] | UNICODE)    // allow \`, \', \\, \/, \f, etc. and \uXXX
//         ;

// fragment UNICODE
//         : 'u' HEX HEX HEX HEX
//         ;

// fragment HEX
//         : [0-9a-fA-F]
//         ;