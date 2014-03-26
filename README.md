CAD tool for Logic Minimization
===============================
-------------------------------

##Created by Jacob Rosenberg, 3-26-14

###For Tufts EE26 - Digital Logic Systems

-----------------------------------------

Software tool for generating minimized 2-level SOP (Sum of Products) and POS (Product of Sums) expressions for any single-output Boolean function (up to 10 literals).

-----------------------------------------

###Features:
  * 2-level SOP and POS Minimization
  * Up to 10 Literals
  * Interactive or File Input

-----------------------------------------

###Input Format:
  * Takes 1 or more minterms and 0 or more don't-cares

####Examples:
  * m(1,2,3,9,10)+d(5,7)
  * m(0,2,3,5,6,7,8,10,11,14,15)
  * m(1,5,3)+d(2,4)

-----------------------------------------

###Output Format:
  * Displays minimal 2-level form in SOP and POS

####Examples:
  * m(1,2,3,9,10)+d(5,7)

    =A'D+B'C'D+B'CD'

    =B'(C+D)(A'+C'+D')

  * m(0,2,3,5,6,7,8,10,11,14,15)

    =C+A'BD+B'D'

    =(B'+C+D)(A'+C+D')(B+C+D')

  * m(1,5,3)+d(2,4)

    =B'C+A'C

    =C(A'B')