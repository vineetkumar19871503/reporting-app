(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{344:function(e,t,a){"use strict";a.r(t);var r=a(90),n=a(91),s=a(94),o=a(92),i=a(93),c=a(0),l=a.n(c),u=a(95),d=a(264),m=a.n(d),h=a(263),p=a(260),f=a(282),E=(a(281),a(262)),v=a.n(E),b=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(s.a)(this,Object(o.a)(t).call(this,e))).errors={},a.state={users:[],cols:[{Header:"Email",accessor:"email"},{Header:"Name",accessor:"name"},{Header:"Actions",Cell:function(e){return l.a.createElement("div",{className:"text-center"},l.a.createElement("button",{onClick:function(){return a.navToEditPage(e)}},"Edit"))}}]},a}return Object(i.a)(t,e),Object(n.a)(t,[{key:"navToEditPage",value:function(e){return alert("Under construction")}},{key:"showLoader",value:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=document.getElementById("ajax-loader-container");e?t.classList.remove("disp-none"):t.classList.add("disp-none")}},{key:"componentDidMount",value:function(){"admin"!==this.props.user.type&&(h.ToastStore.error("You are not authorized to perform this action"),this.props.history.push("/dashboard")),document.title="Users";var e=this;e.showLoader(),m.a.get(v.a.apiUrl+"users/list",{headers:{Authorization:"Bearer "+e.props.user.token}}).then(function(t){e.showLoader(!1),e.setState({users:t.data.data})}).catch(function(t){e.showLoader(!1),h.ToastStore.error(t.message)})}},{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"animated fadeIn"},l.a.createElement(p.C,null,l.a.createElement(p.j,null,l.a.createElement(p.e,null,l.a.createElement(p.i,null,l.a.createElement("strong",null,"Users"),l.a.createElement(p.d,{size:"sm",className:"float-right",color:"primary",onClick:function(){return e.props.history.push("/users/add")}},"Add User")),l.a.createElement(p.f,null,l.a.createElement(h.ToastContainer,{store:h.ToastStore}),l.a.createElement(f.a,{data:this.state.users,columns:this.state.cols,defaultPageSize:10,className:"-striped -highlight"}))))))}}]),t}(l.a.Component);t.default=Object(u.b)(function(e){return{user:e.user}})(b)}}]);
//# sourceMappingURL=15.85d79167.chunk.js.map