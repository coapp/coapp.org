---
layout: 'article'
title: 'CoApp Common Property Sheet' 
version: '1.0'
docid: 'reference:propertysheet'
---
### Purpose

Several of the CoApp tools take input files use a format that is significantly simpler to deal with than XML-based files. While XML is pretty good at representing hierarchical data, it's very error prone, painful to read, and extremly verbosse.

The CoApp property sheet format became the de-facto standard for CoApp tools.

### General Format Guidelines

Generally speaking, CoApp property Sheets contain a collection of *rules*, and each rule can contain a collection of *properties*. 

The syntax for laying out rules draws similarities from **C**, **C#**, and **CSS** languages. Containment is handled with braces `{ }`, and the semicolon ` ; ` is a statement terminator.

Whitespace is not significant, and placements of braces may be done in any fashion (K&R style,ANSI, etc).

#### [Rules](!rules) 

A *rule identifier* is made up of three components: a *rule name* , a *class* and a *selector*.

If the rule name is not specified, it defaults to an asterisk `*` 

Individually, any of the components are optional (although, depending on the application, may be required for a particular purpose)

The format for the rules is as follows:
``` c#
rulename.class[selector] { 
    // properties go here.
}
```

Some examples of different rules, using different peices of the optional rule components:

``` c#
foo { 
    // rule named 'foo' , no class or selector
}

.bar { 
    // rule named '*' with a class named "bar"
}

[baz] { 
    // rule named '*' with a selector ".baz"
}

.bar[baz] {
    // rule named '*' with a class named "bar" and a selector "baz"
}
```


#### [Properties](!properties) 
An individual rule can contain multiple properties, and each property can contain multiple values.

``` c#

rulename {
    // a property with a single value
    property-one : property-value1;
    
    // a property with multiple values:
    property-two: {
        value1, value2, value3
    }
    
    // a property with a key and a value:
    property-three: key = val;
    
    // a property with a key and multiple values:
    property-four : property-key = {
        val-one, val-two
    }
    
    // another way to specifiy a property with a key and multiple values:
    property-four : property-key = val-one;
    property-four : property-key = val-two;
}
```

Property values are [literals](#literals), and seperated by commas `,` or semi-colons `;`. Like C#, you are permitted to have a terminator after the last element in a collection.


#### [Comments](!comments) 
Comments are formatted like C# style comments
``` c#
// line comments are double slashes 
/* 
    block comments

    use c-style slash-star comments
*/
rulename.class[selector] { 
    // properties go here.
}
```

#### [Identifier names](!identifiers) 

Rule names, classes, selectors, property names, and property value-keys may contain letters (A-Z, a-z), numeric digits (0-9), underscores or dashes.

Technically, selectors, property names and property key-values may also be composed of quoted-string literals, but use of such things may be restricted by the tool using the property sheet.

#### [Literals](!literals) 

Literal values in property sheets can be simple, unquoted values  (like numbers, or single word-strings without spaces) or one of two types of quoted string literals, either *regular string literals* and *verbatim string literals*.

A **regular string literal** consists of zero or more characters enclosed in double quotes, as in `"hello"`, and may include both simple escape sequences (such as `\t` for the tab character), and hexadecimal and Unicode escape sequences.

<table border="1" cellspacing="0" cellpadding="0">
<tbody>
    <tr>
        <td ><p><b>Escape sequence</b></p></td>
        <td ><p><b>Character name</b></p></td>
        <td ><p><b>Unicode encoding</b></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\'</span></span></p></td>
        <td ><p>Single quote</p></td>
        <td ><p><span><span>0x0027</span></span></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\"</span></span></p></td>
        <td ><p>Double quote</p></td>
        <td ><p><span><span>0x0022</span></span></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\\</span></span></p></td>
        <td ><p>Backslash</p></td>
        <td ><p><span><span>0x005C</span></span></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\0</span></span></p></td>
        <td ><p>Null</p></td>
        <td ><p><span><span>0x0000</span></span></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\a</span></span></p></td>
        <td ><p>Alert</p></td>
        <td ><p><span><span>0x0007</span></span></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\b</span></span></p></td>
        <td ><p>Backspace</p></td>
        <td ><p><span><span>0x0008</span></span></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\f</span></span></p></td>
        <td ><p>Form feed</p></td>
        <td ><p><span><span>0x000C</span></span></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\n</span></span></p></td>
        <td ><p>New line</p></td>
        <td ><p><span><span>0x000A</span></span></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\r</span></span></p></td>
        <td ><p>Carriage return</p></td>
        <td ><p><span><span>0x000D</span></span></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\t</span></span></p></td>
        <td ><p>Horizontal tab</p></td>
        <td ><p><span><span>0x0009</span></span></p></td>
    </tr>
    <tr>
        <td ><p><span><span>\v</span></span></p></td>
        <td ><p>Vertical tab</p></td>
        <td ><p><span><span>0x000B</span></span></p></td>
    </tr>
</tbody>
</table>

A **verbatim string literal** consists of an @ character followed by a double-quote character, zero or more characters, and a closing double-quote character. A simple example is `@"hello"`. In a verbatim string literal, the characters between the delimiters are interpreted verbatim, the only exception being a *quote-escape-sequence*. In particular, simple escape sequences, and hexadecimal and Unicode escape sequences are not processed in verbatim string literals. A verbatim string literal may span multiple lines.

#### [Macros](!macros) 

If the tool supports macro substituion in the property sheet, macro values are specified by the `${macro}` format. The content of the macro itself is subject to what the tool itself supports.

#### [Iterators](!iterators) 

Some tools (ie, Autopackage) support the concept of an *iterator* -- where a collection can be created from the composition of other collections and macros.

The `=>` operator returns a collection based on the different values passed in a collection:

The statement: ` collection => expression ` takes each value in `collection` and applies it to the `expression`. Using [macros](#macros), you can apply a templates to each item in the collection.

Example:
``` c#
// autopackage example

package-composition {
    symlinks : { 
        exes => @"${bin}\${each.Name}" = @"${packagedir}\${each.Name}";
    };
}
```

