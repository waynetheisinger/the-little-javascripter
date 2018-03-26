function error(desc) {
  throw new Error(desc);
}

function is_list(list)
{
  return _.isArray(list);
}

function car(list) {
  if (!_.isArray(list))
    error("Not an Array");
  if (list.length == 0)
    error("Empty Array");

  return _.first(list);
}

function cdr(list) {
  if (!_.isArray(list))
    error("Not an Array");
  if (list.length == 0)
    error("Empty Array");

  return _.rest(list);
}

function cons(elem, list) {
  if (!_.isArray(list))
    error("Not an Array");

  return [elem].concat(list);
}

function is_null(list) {
  if (!_.isArray(list))
    error("Not an Array");

  return list.length == 0;
}

function is_atom(atom) {
  return _.isString(atom) || _.isNumber(atom);
}

function is_eq(atom1, atom2) {
  if (!_.isString(atom1))
    error("Not an Array");
  if (!_.isString(atom2))
    error("Not an Array");

  return atom1 == atom2;
}

function is_lat(list) {
  if (!_.isArray(list))
    error("Not an Array");

  return _.reduce(list, function(memo, elem) {
    return memo && is_atom(elem);
  }, true);
}

function is_lat(list) {
  return is_null(list) ? true :
         is_atom(car(list)) ? is_lat(cdr(list)) :
         false;
}


// Asume that is_lat(lat) == true
function is_member(item, lat) {
  return is_null (lat) ? false :
         are_eqan (item, car(lat)) ||
         is_member (item, cdr(lat));
}

// 1st Commandment: Always ask null? as the first question in expressing any function.

// Removes the first apparence of the atom in the lat.
function rember(atom, lat) {
  return is_null (lat) ? lat :
         is_eq (car(lat), atom) ? cdr(lat) :
         cons(car(lat), rember(cdr(lat)));
}

// 2nd Commandment: Use cons to build lists.

function firsts(lats) {
  return is_null(lats) ? [] :
         cons(car(car(lats)), firsts(cdr(lats)));
}

// 3rd Commandment: When building a list, describe the 
// first typical element, and then cons it onto the natural recursion.

function insertR(neww, old, lat) {
  return is_null(lat) ? lat :
         is_eq (old, car(lat)) ? cons(old, cons (neww, cdr(lat))) :
         cons(car(lat), insertR(neww, old, cdr(lat)));
}

function insertL(neww, old, lat) {
  return is_null(lat) ? lat :
         is_eq (old, car(lat)) ? cons(neww, cons (old, cdr(lat))) :
         cons(car(lat), insertL(neww, old, cdr(lat)));
}

function subst(neww, old, lat) {
  return is_null(lat) ? lat :
         is_eq (old, car(lat)) ? cons(neww, cdr(lat)) :
         cons(car(lat), insertL(neww, old, cdr(lat)));
}

function subst2(neww, old1, old2, lat) {
  return is_null(lat) ? lat :
         is_eq (old1, car(lat)) ? cons(neww, cdr(lat)) :
         is_eq (old2, car(lat)) ? cons(neww, cdr(lat)) :
         cons(car(lat), insertL(neww, old, cdr(lat)));
}

function multirember(atom, lat) {
  return is_null(lat) ? lat :
         is_eq (atom, car(lat)) ? multirember(atom, cdr(lat)) :
         cons(car(lat), multirember(atom, cdr(lat)));
}

function multiinsertR(neww, old, lat) {
  return is_null(lat) ? lat :
         is_eq(old, car(lat)) ? cons(old, cons(neww, multiinsertR(neww, old, cdr(lat)))) :
         cons(car(lat), multiinsertR(neww, old, cdr(lat)));
}

function multiinsertL(neww, old, lat) {
  return is_null(lat) ? lat :
         is_eq(old, car(lat)) ? cons(neww, cons(old, multiinsertR(neww, old, cdr(lat)))) :
         cons(car(lat), multiinsertR(neww, old, cdr(lat)));
}

// 4th Commandment: Always change at least one argument
// while recurring. It must be changed to be closer to termination.

function multisubst(neww, old, lat) {
  return is_null(lat) ? lat :
         is_eq (old, car(lat)) ? cons(neww, multisubst(neww, old, cdr(lat))) :
         cons(car(lat), multisubst(neww, old, cdr(lat)));
}

// 4th Chapter. Numbers Games.
function add1(atom) { return atom+1 }
function sub1(atom) { return atom-1 }
function is_zero(atom) { return 0 === atom }

function add(a, b) {
  return is_zero(b) ? a :
         add(add1(a), sub1(b));
}

function sub(a, b) {
  return is_zero(b) ? a :
         sub(sub1(a), sub1(b));
}

// Where tup is a list of numbers.
function addtup(tup) {
  return is_null(tup) ? 0 :
         add(car(tup), addtup(cdr(tup)));
}

// 1th Commandment: First Revision
// When recurring on a list of atoms, lat, ask two questions
// about it: ( null ? lat) and else.
// When recurring on a number, n , ask two questions about
// it: (zero ? n) and else.

// 4th Commandment: First Revision
// Always change at least one argument while recurring. It
// must be changed to be closer to termination. The changing
// argument must be tested in the termination condition:
// when using cdr, test termination with null? and
// when using sub1 , test termination with zero ?.

function prod(a, b) {
  return is_zero(b) ? 0 :
         b == 1 ? a :
         prod(add(a, a), sub(b, 1));
}

// 5th Commandment:
// When building a value with + , always use 0 for the value of the
// terminating line, for adding 0 does not change the value of an
// addition.
// When building a value with x , always use 1 for the value of the
// terminating line, for multiplying by 1 does not change the value
// of a multiplication.
// When building a value with cons, always consider [] for 
// the value of the terminating line.

function tupplus(tup1, tup2) {
  return is_null(tup1) ? tup1 :
         cons(add(car(tup1), car(tup2)), tupplus(cdr(tup1), cdr(tup2)));
}

function gt(a, b) {
  return is_zero(a) ? false :
         is_zero(b) ? true :
         gt(a-1, b-1);
}

function lt(a, b) {
  return is_zero(b) ? false :
         is_zero(a) ? true :
         gt(a-1, b-1);
}

// function eq_num(a, b) {
//   return 
// }

function is_number(elem) {
  return _.isNumber(elem);
}

function all_nums(tup) {
  return is_null(tup) ? tup :
         is_atom(car(tup)) ? (
           is_number(car(tup)) ? cons(car(tup), all_nums(cdr(tup))) : all_nums(cdr(tup))) :
         cons(all_nums(car(tup)), all_nums(cdr(tup)));
}

function are_eqan(a1, a2) {
  return is_number(a1) && is_number(a2) ? (a1 === a2) :
         is_eq(a1, a2);
}

// Chapter 5.
// TODO: rember*, insertR*, 

//The First Commandment
// (final version)
// When recurring on a list of atoms, lat , ask two questions
// about it: ( null? lat) and else.
// When recurring on a number, n , ask two questions about
// it: (zero ? n) and else.
// When recurring on a list of S-expressions, l, ask three
// question about it: ( null? l ) , ( atom ? ( car l) ) , and else.

// The Fourt h Commandment
// (final version)
// Always change at least one argument while recurring.
// When recurring on a list of atoms, lat, use ( cdr lat ) . When
// recurring on a number, n , use (sub1 n) . And when recur­
// ring on a list of S-expressions, l , use ( car l) and ( cdr l) if
// neither ( null ? l) nor ( atom ? ( car l)) are true.
// It must be changed to be closer to termination. The chang­
// ing argument must be tested in the termination condition:
// when using cdr , test termination with null ? and
// when using sub1 , test termination with zero ?.

// TODO: occur*, subst*, insertL*, member*

function leftmost(list) {
  return is_atom(car(list)) ? car(list) :
         leftmost(car(list));
}

function eqlist(l1, l2) {
  return is_null(l1) && is_null(l2) ?
           true :
         is_null(l1) || is_null(l2) ?
           false :
         !is_atom(car(l1)) && !is_atom(car(l2)) ?
           eqlist(car(l1), car(l2)) && eqlist(cdr(l1), cdr(l2)) :
         !is_atom(car(l1)) || !is_atom(car(l2)) ?
           false :
         are_eqan(car(l1), car(l2)) && eqlist(cdr(l1), cdr(l2));
}

function equal(s1, s2) {
  return is_atom(s1) && is_atom(s2) ?
           are_eqan(s1, s2) :
         is_atom(s1) || is_atom(s2) ?
           false :
         eqlist(s1, s2);
}

// T he S ixt h Commandment
// Simplify only after the function is correct.

// Chapter 6. Shadows.

// An arithmetic expression (AE) is:
// - An atom
// - An AE followed by (+|x|↑) and another AE.
// A numbered arithmetic expression is an AE w/only numbers.
// Numbered takes an AE and checks if it's a numbered AE.
function numbered(aexp) {
  return is_atom(aexp) ? true :
         numbered(car(aexp)) && numbered(car(cdr(cdr(aexp))));
}

function value(aexp) {
  return is_atom(aexp) ? aexp :
         is_eq(car(cdr(aexp)), '+') ?
           value(car(aexp)) + value(car(cdr(cdr(aexp)))) :
         is_eq(car(cdr(aexp)), 'x') ?
           value(car(aexp)) * value(car(cdr(cdr(aexp)))) :
         Math.pow(value(car(aexp)), value(car(cdr(cdr(aexp)))));
}

// The S event h Commandment
// Recur on the subparts that are of the same nature:
// • On the sublists of a list.
// • On the subexpressions of an arithmetic expression.

// function first-exp(aexp) {
//   return car(cdr(
// }
// function vvalue(aexp)

// The Eight h Commandment
// Use help functions to abstract from representations.

// TODO: sero?, edd1, zub1, +,

// Chapter 7. Friends and relations.

function set(lat) {
  return is_null(lat) ? true :
         is_member(car(lat), cdr(lat)) ? false :
         set(cdr(lat));
}

function makeset(lat) {
  return is_null(lat) ? true :
         is_member(car(lat), cdr(lat)) ? makeset(cdr(lat)) :
         cons(car(lat), cdr(lat));
}

function subset(set1, set2) {
  return is_null(set2) ? true :
         is_member(car(set2), set1) && subset(set1, cdr(set2));
}

function eq_set(set1, set2) {
  return subset(set1, set2) && subset(set2, set1);
}

function intersect(set1, set2) {
  return is_null(set1) ? set1 :
         is_member(car(set1), set2) ? cons(car(set1), intersect(cdr(set1), set2)) :
         intersect(cdr(set1), set2);
}

function union(set1, set2) {
  return is_null(set2) ? set1 :
         is_member(car(set2), set1) ? union(set1, cdr(set2)) :
         union(cons(car(set2), set1), cdr(set2));
}

function intersect_all(lats) {
  return is_null(lats) ? lats :
         is_null(cdr(lats)) ? car(lats) :
         intersect(car(lats), intersectall(cdr(lats)));
}

function pair(s_exp) {
  return is_atom(s_exp) ? false :
         is_null(s_exp) ? false :
         is_null(cdr(s_exp)) ? false :
         is_null(cdr(cdr(s_exp))) ? true :
         false;
}

first = car;
function second(list) {
  return car(cdr(list));
}

function build(s1, s2) {
  cons(s1, cons(s1, []));
}

function third(list) {
  return car(cdr(cdr(list)));
}

function fun(pairs) {
  return set(firsts(pairs));
}

function revrel(rel) {
  return is_null(rel) ? rel :
         cons(build(second(car(rel)), first(car(rel))), revrel(cdr(rel)));
}

function one2one(fun) {
  return fun(revrel(rel));
}

// Chapter 8. Lambda de ultimate.

function remberf(tester, a, l) {
  return is_null(l) ? l :
         tester(a, car(l)) ? remberf(tester, a, cdr(l)) :
         cons(car(l), remberf(tester, a, cdr(l)));
}

// TODO: rember-f curried, insertL-f, insertR-f, seqL, seqR, insert-g

// The Nint h Commandment
// Abstract common patterns with a new function.

// TODO: multirember-f

// Chapter 9. And again, and again, and again..

function shift(pair) {
  return [pair[0][0], [pair[0][1], pair[1]]];
}

function align(pora) {
  return is_atom(pora) ? pora :
         pair(first(pora)) ? :
}

(lambda (l)
  (cond
    ((null? l) 0)
    (else (add1 (eternity (cdr l))))))

(lambda (l)
  (cond
    ((null? l) 0)
    (else
      (add1
        ((lambda (l)
           (cond
             ((null? l) 0)
             (else (add1 (eternity (cdr l))))))
          (cdr l))))))

(lambda (l)
  (cond
    ((null? l) 0)
    (else
      (add1
        ((lambda (l)
            (cond
              ((null? l) 0)
              (else (add1
                ((lambda (l)
                 (cdr l)))))))
         (cdr l))))))

((lambda (length)
  (lambda (l)
    (cond
      ((null? l) 0)
      (else add1 (length (cdr (l))))))
 eternity)

((lambda (length)
  (lambda (l)
    (cond
      ((null? l) 0)
      (else add1 (length (cdr (l))))))
 eternity)

((lambda (f)
  (lambda (l)
    (cond
      ((null? l) 0)
      (else (add1 (f (cdr l)))))))

((lambda (g)
  (lambda (l)
    (cond
      ((null? l) 0)
      (else (add1 (g (cdr l)))))))
  eternity)) 

((lambda (f)
  (lambda (l)
    (cond
      ((null? l) 0)
      (else (add1(f(cdr(l))))))))
((lambda (g)
  (lambda (l)
    (cond
      ((null? l) 0)
      (else (add1(g(cdr(l))))))))

((lambda (mk-length)
  (mk-length eternity))
 (lambda (length)
   (lambda (l)
     (cond
       ((null? l) 0)
       (else (add1 (length (cdr l))))))))

(lambda (l)
  (cond
    ((null? l) 0)
    (else (add1(g(cdr(l))))))))

(function(f) {
  return function(l) {
    return is_null(l) ? 0 :
           1 + f(cdr(l));
  };
(function(g) {
));

((lambda (mk-length)
  (mk-length mk-length)))
((lambda (length)
  (lambda (l)
    (cond
      ((null? l) 0)
      (else
        (add1(length(cdr(l))))))))))

(((lambda(mk-length)
    (mk-length mk-length))
  (lambda(mk-length)
    (lambda(l)
      (cond
        ((null? l) 0)
        (else (add1
          ((mk-length eternity) (cdr l))))))))
  (apples))

mk-length mk-length
=
(lambda(l)
  (cond
    ((null? l) 0)
    (else (add1
      ((mk-length eternity) (cdr l))))))))

mk-length mk-length (apples)
=
add1 ((mk-length eternity) (quote ()))

mk-length eternity
(lambda(l)
  (cond
    ((null? l) 0)
    (else (add1
      ((eternity eternity) (cdr l))))))))


var fact = function(n) {
  if (n < 2) return 1;
  else return n*fact(n-1);
};


