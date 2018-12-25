(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{268:function(e,t,a){"use strict";var n={print:function(e){try{var t=document.getElementById(e).innerHTML,a=window.open("","Print","height=600,width=800");return a.document.write("<html><head><title></title>"),a.document.write("</head><body >"),a.document.write(t),a.document.write("</body></html>"),a.document.close(),a.focus(),a.print(),a.close(),!0}catch(n){console.log(n.message),alert("Please allow Pop-up for priting the bill.")}},moneyToWords:function(e){return a(269)(e)}};t.a=n},343:function(e,t,a){"use strict";a.r(t);var n=a(333),r=a(90),l=a(91),o=a(94),c=a(92),i=a(93),s=a(96),m=a(0),d=a.n(m),u=a(95),p=a(264),E=a.n(p),h=a(263),g=a(331),b=(a(328),a(260)),y=a(282),f=(a(281),a(262)),x=a.n(f),v=a(268),T=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(o.a)(this,Object(c.a)(t).call(this,e))).errors={},a.searchBill=a.searchBill.bind(Object(s.a)(Object(s.a)(a))),a.clearSearch=a.clearSearch.bind(Object(s.a)(Object(s.a)(a))),a.state={search:{k_number:"",startDate:new Date,endDate:new Date},bills:[],printData:{},reportData:{},cols:[{Header:"K Number",accessor:"consumer.k_number"},{Header:"Amount",accessor:"amount"},{Header:"Payment Mode",accessor:"payment_mode"},{Header:"Consumer Name",accessor:"consumer.consumer_name"},{Header:"Receipt Number",accessor:"receipt_number"},{Header:"Actions",Cell:function(e){return d.a.createElement(b.C,null,d.a.createElement(b.j,{md:"6"},d.a.createElement(b.d,{block:!0,size:"sm",color:"primary",onClick:function(){return a.printBill(e)}},"Print")),d.a.createElement(b.j,{md:"6"},d.a.createElement(b.d,{block:!0,size:"sm",color:"success",onClick:function(){return a.printReport(e)}},"Report")))}}]},a}return Object(i.a)(t,e),Object(l.a)(t,[{key:"changeInput",value:function(e,t){var a=Object.assign({},this.state);a.search[e]=t,this.setState(a)}},{key:"getTime",value:function(e){return(e=new Date(e)).getDate()+"/"+(e.getMonth()+1)+"/"+e.getFullYear()+" "+this.addZeroToTime(e.getHours())+":"+this.addZeroToTime(e.getMinutes())+":"+this.addZeroToTime(e.getSeconds())}},{key:"addZeroToTime",value:function(e){return e<10&&(e="0"+e),e}},{key:"printBill",value:function(e){this.setState({printData:e.original},function(){v.a.print("printContainer")})}},{key:"printReport",value:function(e){this.setState({reportData:e.original},function(){v.a.print("reportContainer")})}},{key:"searchBill",value:function(e){e.preventDefault();var t=Object.assign({},this.state.search);t.k_number.trim()||delete t.k_number,t.startDate||delete t.startDate,t.endDate||delete t.endDate,this.getBills(t)}},{key:"clearSearch",value:function(){var e=this;e.setState({search:{k_number:"",startDate:"",endDate:""}},function(){return e.getBills()})}},{key:"componentDidMount",value:function(){document.title="Bills",this.getBills()}},{key:"getAmount",value:function(e){return e=Math.round(e),v.a.moneyToWords(e)}},{key:"getBills",value:function(e){var t=this,a={headers:{Authorization:"Bearer "+t.props.user.token}};e&&(a.params=e),t.showLoader(),E.a.get(x.a.apiUrl+"bills/list",a).then(function(e){t.showLoader(!1),t.setState({bills:e.data.data})}).catch(function(e){t.showLoader(!1),h.ToastStore.error(e.message)})}},{key:"showLoader",value:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=document.getElementById("ajax-loader-container");e?t.classList.remove("disp-none"):t.classList.add("disp-none")}},{key:"render",value:function(){var e=this,t=this.state.printData,a=this.state.reportData;return d.a.createElement("div",{className:"animated fadeIn"},d.a.createElement(b.C,null,d.a.createElement(b.j,null,d.a.createElement(b.e,null,d.a.createElement(b.i,null,d.a.createElement("strong",null,"Bills"),d.a.createElement(b.d,{size:"sm",className:"float-right",color:"primary",onClick:function(){return e.props.history.push("/bills/add")}},"Add Bill")),d.a.createElement(b.f,null,d.a.createElement(h.ToastContainer,{store:h.ToastStore}),d.a.createElement(b.p,{onSubmit:this.searchBill},d.a.createElement(b.C,null,d.a.createElement(b.j,{md:"3"},d.a.createElement(b.q,null,d.a.createElement(b.v,{htmlFor:"k_number"},"K Number"),d.a.createElement(b.r,{type:"text",id:"k_number",value:this.state.search.k_number,onChange:function(t){return e.changeInput("k_number",t.target.value)},placeholder:"Enter K Number"}))),d.a.createElement(b.j,{md:"3"},d.a.createElement(b.q,null,d.a.createElement(b.v,{htmlFor:"startDate"},"Date From"),d.a.createElement("br",null),d.a.createElement(g.a,{className:"form-control",placeholderText:"Date From",selected:this.state.search.startDate,onChange:function(t){return e.changeInput("startDate",t)}}))),d.a.createElement(b.j,{md:"3"},d.a.createElement(b.q,null,d.a.createElement(b.v,{htmlFor:"endDate"},"Date To"),d.a.createElement("br",null),d.a.createElement(g.a,{className:"form-control",placeholderText:"Date To",selected:this.state.search.endDate,onChange:function(t){return e.changeInput("endDate",t)}}))),d.a.createElement(b.j,{md:"3"},d.a.createElement("br",null),d.a.createElement("div",{style:{paddingTop:"6px"}},d.a.createElement(b.d,{color:"primary",className:"px-4"},"Search"),d.a.createElement(b.d,{color:"danger",onClick:this.clearSearch,className:"px-4"},"Clear"))))),d.a.createElement(y.a,{data:this.state.bills,columns:this.state.cols,defaultPageSize:10,className:"-striped -highlight"}),Object.keys(t).length>0?d.a.createElement("div",{id:"printContainer",style:{padding:"20px",display:"none"}},d.a.createElement("div",{style:{marginTop:"40px",width:"100%",textAlign:"center",borderBottom:"1px solid black",marginBottom:"15px"}},d.a.createElement("h2",null,"Government of Rajasthan",d.a.createElement("br",null),"District e-Governance Society (Jodhpur)")),d.a.createElement("table",{border:"0",cellPadding:"0",cellSpacing:"0",width:"100%",style:{marginBottom:"15px"}},d.a.createElement("tbody",null,d.a.createElement("tr",null,d.a.createElement("td",{width:"50%",style:k.allBorders},d.a.createElement("div",{style:{padding:"15px"}})),d.a.createElement("td",{style:k.allBordersExceptLeft},d.a.createElement("div",{style:{padding:"15px"}},"Code: K21005887 [ AKSH.AKSH.2366.JOD ] ",d.a.createElement("br",null),"Kiosk: AKSH OPTIFIBRE LTD ",d.a.createElement("br",null),"LSP: AKSH OPTIFIBRE ",d.a.createElement("br",null),"Phone: 9928268192 ",d.a.createElement("br",null),"Email: SENSANETWORKING@GMAIL.COM"))))),d.a.createElement("table",{cellPadding:"0",cellSpacing:"0",border:"0",width:"100%",style:{marginBottom:"15px"}},d.a.createElement("tbody",null,d.a.createElement("tr",null,d.a.createElement("td",{width:"50%",style:{paddingLeft:"30px"}},d.a.createElement("strong",null,"Receipt No:")," ",t.receipt_number),d.a.createElement("td",{style:{paddingLeft:"30px"}},d.a.createElement("strong",null,"Receipt Date/Time:")," ",this.getTime(t.bill_submission_date))))),d.a.createElement("table",{cellPadding:"0",cellSpacing:"0",border:"0",width:"100%"},d.a.createElement("thead",null,d.a.createElement("tr",null,d.a.createElement("th",{align:"center",style:k.allBorders},"Sr No."),d.a.createElement("th",{align:"center",style:k.allBordersExceptLeft},"Department/Service"),d.a.createElement("th",{align:"center",style:k.allBordersExceptLeft},"Consumer Info"),d.a.createElement("th",{align:"center",style:k.allBordersExceptLeft},"Trans ID"),d.a.createElement("th",{align:"center",style:k.allBordersExceptLeft},"Mode Ref No"),d.a.createElement("th",{align:"center",style:k.allBordersExceptLeft},"Amount"))),d.a.createElement("tbody",null,d.a.createElement("tr",null,d.a.createElement("td",{align:"center",style:k.allBordersExceptTop},"1"),d.a.createElement("td",{align:"center",style:k.allBordersExceptTopAndLeft},"DISCOM/K No"),d.a.createElement("td",{align:"center",style:k.allBordersExceptTopAndLeft},(t.consumer.k_number+"/"+t.consumer.consumer_name).toUpperCase()),d.a.createElement("td",{align:"center",style:k.allBordersExceptTopAndLeft},t.trans_id),d.a.createElement("td",{align:"center",style:k.allBordersExceptTopAndLeft},t.payment_mode.toUpperCase()),d.a.createElement("td",{align:"right",style:k.allBordersExceptTopAndLeft},d.a.createElement("div",{style:{paddingRight:"15px"}},t.amount.toFixed(4)))),d.a.createElement("tr",null,d.a.createElement("td",{colSpan:"5",style:k.allBordersExceptTop},d.a.createElement("strong",{style:{paddingLeft:"15px"}},"Grand Total")),d.a.createElement("td",{align:"right",style:k.allBordersExceptTopAndLeft},d.a.createElement("strong",{style:{paddingRight:"15px"}},t.amount.toFixed(4)))))),d.a.createElement("div",{style:{marginTop:"8px",fontSize:"15px",fontStyle:"italic"}},"Disclaimer: Payment through Cheque or DD are subject to realization."),d.a.createElement("div",{style:{marginTop:"30px"}},"Received Amount Rs. ",t.amount.toFixed(4)," ( Rupees ",this.getAmount(t.amount)," Only )"),d.a.createElement("div",{style:{textAlign:"center",fontStyle:"italic",fontSize:"15px",marginTop:"40px"}},"(This is a computer generated receipt and requires no signature)")):null,Object.keys(a).length>0?d.a.createElement("div",{id:"reportContainer",style:{padding:"50px",display:"none"}},d.a.createElement("br",null),d.a.createElement("br",null),d.a.createElement("br",null),d.a.createElement("span",{style:k.font18},"Receipt No: ",a.receipt_number),d.a.createElement("span",{style:Object(n.a)({marginLeft:"150px"},k.font18)},"Date: ",this.getTime(a.bill_submission_date)),d.a.createElement("br",null),"----------------------------------------------------------------------------------------------------------- ",d.a.createElement("br",null),d.a.createElement("table",{border:"0"},d.a.createElement("tbody",null,d.a.createElement("tr",null,d.a.createElement("td",{style:k.font18},"DeptName/ServiceName/ConsumerKey/ConsumerName"),d.a.createElement("td",{style:Object(n.a)({paddingLeft:"15px",paddingRight:"15px"},k.font18)},"Transaction No"),d.a.createElement("td",{style:Object(n.a)({paddingLeft:"15px",paddingRight:"15px"},k.font18)},"Amount (Rs.)")),d.a.createElement("tr",null,d.a.createElement("td",{style:k.font18},"DISCOM/K No/",a.consumer.k_number,"/",a.consumer.consumer_name),d.a.createElement("td",{align:"center",style:Object(n.a)({paddingLeft:"15px",paddingRight:"15px"},k.font18)},a.trans_id),d.a.createElement("td",{align:"right",style:Object(n.a)({paddingLeft:"15px",paddingRight:"15px"},k.font18)},a.amount.toFixed(1))))),"----------------------------------------------------------------------------------------------------------- ",d.a.createElement("br",null),d.a.createElement("span",{style:k.font18},"Received Rs. ",a.amount.toFixed(4),"/- (Rupees ",this.getAmount(a.amount)," Only) For Services Listed Above. ",d.a.createElement("br",null),"Pay Mode/Payment Ref No: ",a.payment_mode.toUpperCase()," ",d.a.createElement("br",null),"Signature ",d.a.createElement("br",null),"AKSH OPTIFIBRE LTD (Kiosk Code-Sso Id: K21005887-AKSH.AKSH.2366.JOD) ",d.a.createElement("br",null),"Contact Number: 9928268192"),d.a.createElement("br",null),"----------------------------------------------------------------------------------------------------------- ",d.a.createElement("br",null),"----------------------------------------------------------------------------------------------------------- ",d.a.createElement("br",null)):null)))))}}]),t}(d.a.Component),k={allBorders:{border:"1px solid black"},allBordersExceptLeft:{borderTop:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black"},allBordersExceptTop:{borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black"},allBordersExceptTopAndLeft:{borderRight:"1px solid black",borderBottom:"1px solid black"},font18:{fontSize:"18px"}};t.default=Object(u.b)(function(e){return{user:e.user}})(T)}}]);
//# sourceMappingURL=14.02141dfa.chunk.js.map