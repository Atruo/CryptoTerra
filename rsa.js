
   
 v a r   d i g e s t   =   { } ; 
 
 v a r   s h a 1   =   d i g e s t . s h a 1 ( ) ; 
 m d . i n i t ( ) ; 
 m d . u p d a t e ( ) ; 
 h a s h   =   m d . f i n a l ( ) ; 
 
 
 
 v a r   R S A   =   { } ; 
 
 r s a . r a n d _ k e y   =   r s a _ r a n d _ k e y ; 
 r s a . s s a _ p s s _ p a r a m s   =   { 
 	 d i g e s t   =   s h a 1 ; 
 	 m g a   =   m g s _ s h a 1 ; 
 } ; 
 
 
 f u n c t i o n   r s a _ r a n d _ k e y ( b i t s ,   e )   { 
 	 t h i s . p   =   b n _ r a n d _ p r i m e ( b i t s ) ; 
 	 t h i s . q   =   b n _ r a n d _ p r i m e ( b i t s ) ; 
 	 t h i s . n   =   b n _ m u l ( p ,   q ) ; 
 	 t h i s . e   =   6 5 5 3 7 ; 
 	 t h i s . b a r r e t t   =   n e w   b n _ b a r r e t t _ u ( m ) ; 
 } 
 
 f u n c t i o n   r s a _ e n c r y p t ( r s a _ k e y ,   b y t e s )   { 
 	 
 	 v a r   r   =   b n _ m o d _ b a r r e t t _ p o w ( b y t e s ,   r a s _ k e y . e ) ; 
 } 
 
 f u n c t i o n   r s a _ d e c r y p t ( r s a _ k e y ,   b y t e s )   { 
 	 
 	 r   =   b n _ m o d _ b a r r e t t _ p o w ( b y t e s ,   r s a _ k e y . d ) ; 
 	 
 	 r e t u r n   r ; 
 } 
