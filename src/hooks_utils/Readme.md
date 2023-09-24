here's how i structurize my react hooks
CONTROLLER is like a sets of method that handle or simplified get set of a hooks
SERVICE is like a sets of method that handling more than get set of a hooks, like integrating api you can say taht
SERVICE is more complex than get set, but still tightly coupled to the hooks, if a service only using one hooks than i will
define it as hookService or HookService, if coupled into more than one hook then i will create its own sevices....
By using this struture we can centralized how we call the react hooks by using only this 2 methods.. and it can be extends..
