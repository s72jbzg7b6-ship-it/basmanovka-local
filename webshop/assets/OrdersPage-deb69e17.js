import{r as N,j as t}from"./vendor-react-abc83e78.js";import{u as be,a as I,b as k}from"./vendor-query-b27e98e7.js";import{u as ye,q as c,a as u,L as Z,E as ee,b as te,A as V}from"./index-c63233ff.js";import{O as ne}from"./OrderStatusBadge-a5a16140.js";import{P as Q}from"./PageScaffold-62c9520f.js";import{T as fe}from"./ToastStack-c8d988ca.js";import{b as D,f as K,a as R}from"./format-2db05949.js";import{L as we}from"./vendor-router-e2eee858.js";import"./vendor-2ecdca4b.js";const je={ACTIVE:"Активен",DISABLED:"Отключён"},_e={ACTIVE:"В процессе",ARCHIVED:"Завершён",DRAFT:"Черновик",FAILED:"Ошибка",PROCESSING:"Обрабатывается",READY:"Готов"},ve=1.2;function Ne(e){return je[e]??e}function Ee(e){return _e[e]??e}function ie(e){return`${R(e.deliveryDate)} · ${Ee(e.status)}`}function L(e){if(e instanceof V){if(e.status===401)return"Сессия завершилась. Войдите снова и повторите действие с Excel заказа.";if(e.status===403)return"Для работы с Excel заказа нужны права администратора.";if(e.status===404)return"Заказ или Excel-файл заказа не найден."}return e instanceof Error&&e.message?e.message:"Не удалось подготовить Excel заказа."}function Pe(e){if(e instanceof V){if(e.status===401)return"Сессия завершилась. Войдите снова и повторите выгрузку заказов.";if(e.status===403)return"Для выгрузки заказов нужны права администратора.";if(e.status===404)return"Каталог или Excel-файл сводки не найден."}return e instanceof Error&&e.message?e.message:"Не удалось подготовить и скачать сводку заказов."}function Ae(e){if(e instanceof V){if(e.status===401)return"Сессия завершилась. Войдите снова и повторите закрытие каталога.";if(e.status===403)return"Для закрытия каталога нужны права администратора.";if(e.status===404)return e.message.includes("Cannot POST")||e.message.includes("/admin/catalog-versions/active/close")?"Backend ещё не обновлён: маршрут закрытия каталога не найден. Перезапустите сервер и повторите действие.":"Активный каталог не найден. Список версий будет обновлён."}return e instanceof Error&&e.message?e.message:"Не удалось закрыть активный каталог."}function T(e){return e==null?"—":`${new Intl.NumberFormat("ru-RU").format(e)} шт`}function Se(e){return new Intl.NumberFormat("ru-RU").format(e)}function $e(e){return T(e.totalQuantity)}function s(e){const r={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};return String(e??"").replace(/[&<>"']/g,a=>r[a])}function M(e){return Number(e.replace(",","."))}function ae(e){return e.toLocaleString("ru-RU",{maximumFractionDigits:2,minimumFractionDigits:2})}function F(e){const r=M(e);return Number.isFinite(r)?ae(r):e}function de(e){const r=M(e);return Number.isFinite(r)?ae(r/ve):"—"}function re(e,r){return e.items.map(a=>r==="plain"?`
          <tr>
            <td>${s(a.article)}</td>
            <td>${s(a.name)}</td>
            <td>${s(a.attribute1??"")}</td>
            <td>${s(a.attribute2??"")}</td>
            <td>${s(a.attribute3??"")}</td>
            <td class="quantity">${s(a.qty)}</td>
          </tr>
        `:`
        <tr>
          <td>${s(a.article)}</td>
          <td>${s(a.name)}</td>
          <td>${s(a.category)}</td>
          <td>${s(a.attribute1??"")}</td>
          <td>${s(a.attribute2??"")}</td>
          <td>${s(a.attribute3??"")}</td>
          <td class="quantity">${s(a.qty)}</td>
          <td>${s(F(a.finalPrice))}</td>
          <td>${s(F(a.lineTotal))}</td>
          <td>${s(de(a.finalPrice))}</td>
        </tr>
      `).join("")}function ke(e,r){return r==="plain"?`
      <table class="order-print-table order-print-table--plain">
        <thead>
          <tr>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Высота</th>
            <th>Вес</th>
            <th>Диаметр горшка</th>
            <th>Количество</th>
          </tr>
        </thead>
        <tbody>
          ${re(e,r)}
        </tbody>
      </table>
    `:`
    <table class="order-print-table order-print-table--priced">
      <thead>
        <tr>
          <th>Артикул</th>
          <th>Наименование</th>
          <th>Категория</th>
          <th>Высота</th>
          <th>Вес</th>
          <th>Диаметр горшка</th>
          <th>Количество</th>
          <th>Цена за единицу, BYN</th>
          <th>Сумма, BYN</th>
          <th>Цена за единицу без НДС, BYN</th>
        </tr>
      </thead>
      <tbody>
        ${re(e,r)}
        <tr class="total-row">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>Итого</td>
          <td>${s(F(e.totalAmount))}</td>
          <td></td>
          <td>${s(de(e.totalAmount))}</td>
        </tr>
      </tbody>
    </table>
  `}function De(e,r,a){const p=r==="plain"?"без цен":"с ценами";return`
    <section class="print-order">
      <header class="print-header">
        <div>
          <div class="print-title">Заказ №${s(e.orderNumber)}</div>
          <div>Клиент: ${s(e.client.name)}</div>
        </div>
        <div class="print-meta">
          <span>Поставка: ${s(R(e.deliveryDate))}</span>
          <span>Подтверждён: ${s(K(e.confirmedAt))}</span>
          <span>Печать: ${s(p)}</span>
          ${a?`<span>Excel: ${s(a)}</span>`:""}
        </div>
      </header>
      ${ke(e,r)}
    </section>
  `}function se(e,r,a={}){var E;const p=e.length===1?`Печать заказа ${((E=e[0])==null?void 0:E.orderNumber)??""}`:`Печать заказов: ${e.length}`,O=e.map(C=>De(C,r,a[C.id])).join("");return`<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>${s(p)}</title>
    <style>
      @page {
        margin: 8mm;
        size: A4 landscape;
      }

      * {
        box-sizing: border-box;
      }

      body {
        color: #111817;
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
      }

      .print-order {
        break-after: page;
        page-break-after: always;
        width: 100%;
      }

      .print-order:last-child {
        break-after: auto;
        page-break-after: auto;
      }

      .print-header {
        align-items: flex-start;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .print-title {
        font-size: 18px;
        font-weight: 700;
        line-height: 1.18;
      }

      .print-meta {
        color: #5f6c68;
        display: grid;
        font-size: 11px;
        gap: 3px;
        text-align: right;
      }

      table {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
      }

      th,
      td {
        border: 1px solid #000;
        line-height: 1.12;
        padding: 3px 4px;
        text-align: center;
        vertical-align: middle;
        word-break: break-word;
      }

      th {
        background: #f2f6f4;
        font-weight: 700;
      }

      .order-print-table--priced {
        font-size: 9.4px;
      }

      .order-print-table--priced th:nth-child(1),
      .order-print-table--priced td:nth-child(1) {
        width: 8%;
      }

      .order-print-table--priced th:nth-child(2),
      .order-print-table--priced td:nth-child(2) {
        text-align: left;
        width: 24%;
      }

      .order-print-table--priced th:nth-child(3),
      .order-print-table--priced td:nth-child(3) {
        width: 10%;
      }

      .order-print-table--priced th:nth-child(4),
      .order-print-table--priced td:nth-child(4),
      .order-print-table--priced th:nth-child(5),
      .order-print-table--priced td:nth-child(5) {
        width: 6%;
      }

      .order-print-table--priced th:nth-child(6),
      .order-print-table--priced td:nth-child(6) {
        width: 10%;
      }

      .order-print-table--priced th:nth-child(7),
      .order-print-table--priced td:nth-child(7) {
        width: 8%;
      }

      .order-print-table--priced th:nth-child(8),
      .order-print-table--priced td:nth-child(8),
      .order-print-table--priced th:nth-child(9),
      .order-print-table--priced td:nth-child(9) {
        width: 10%;
      }

      .order-print-table--priced th:nth-child(10),
      .order-print-table--priced td:nth-child(10) {
        width: 18%;
      }

      .order-print-table--plain {
        font-size: 11px;
      }

      .order-print-table--plain th:nth-child(1),
      .order-print-table--plain td:nth-child(1) {
        width: 13%;
      }

      .order-print-table--plain th:nth-child(2),
      .order-print-table--plain td:nth-child(2) {
        text-align: left;
        width: 43%;
      }

      .order-print-table--plain th:nth-child(3),
      .order-print-table--plain td:nth-child(3),
      .order-print-table--plain th:nth-child(4),
      .order-print-table--plain td:nth-child(4),
      .order-print-table--plain th:nth-child(5),
      .order-print-table--plain td:nth-child(5) {
        width: 11%;
      }

      .order-print-table--plain th:nth-child(6),
      .order-print-table--plain td:nth-child(6) {
        width: 12%;
      }

      td:nth-child(2),
      .total-row td {
        font-weight: 700;
      }

      .quantity {
        color: #0070c0;
        font-weight: 700;
      }

      .total-row td {
        height: 28px;
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  </head>
  <body>
    ${O}
    <script>
      window.addEventListener('load', function () {
        window.setTimeout(function () {
          window.print();
        }, 120);
      });
    <\/script>
  </body>
</html>`}function Ce(e,r,a,p){e.document.open(),e.document.write(se([r],p,{[r.id]:a})),e.document.close(),e.focus()}function Ke(e,r,a){e.document.open(),e.document.write(se(r,a)),e.document.close(),e.focus()}function Me(){const e=ye(),r=be(),[a,p]=N.useState(null),[O,E]=N.useState(""),[C,B]=N.useState(null),[g,z]=N.useState(null),[U,Y]=N.useState(null),[q,o]=N.useState(null),H=I({enabled:e.isAdmin&&!e.isLoading,queryKey:c.admin.catalogVersions(e.viewerKey),queryFn:({signal:n})=>u.admin.catalogVersions.list({signal:n})}),f=H.data??[],P=f.find(n=>n.id===O)??f.find(n=>n.status==="ACTIVE")??f.find(n=>n.status==="READY")??f[0]??null,G=f.find(n=>n.status==="ACTIVE")??null,A=(P==null?void 0:P.id)??"",W={catalogVersionId:A||null},S=I({enabled:e.isAdmin&&!e.isLoading,queryKey:c.admin.orders(e.viewerKey,W),queryFn:({signal:n})=>u.admin.orders.list(W,{signal:n})}),$=I({enabled:e.isAdmin&&!e.isLoading&&!!a,queryKey:a?c.admin.orderDetail(e.viewerKey,a):c.admin.orderDetail(e.viewerKey,"missing"),queryFn:({signal:n})=>u.admin.orders.detail(a,{signal:n})}),w=k({mutationFn:async n=>{const i=n.excelFile??(await u.admin.orders.generateExcel(n.id)).excelFile;return await u.admin.orders.downloadExcel(n.id,i.id,i.fileName),{excelFile:i,orderId:n.id}},onError:n=>{o({kind:"error",message:L(n)})},onSettled:async(n,i,l)=>{B(null),l&&await Promise.all([r.invalidateQueries({queryKey:c.admin.orders(e.viewerKey)}),r.invalidateQueries({queryKey:c.admin.orderDetail(e.viewerKey,l.id)})])},onSuccess:()=>{o({kind:"success",message:"Excel заказа подготовлен и скачан."})},retry:!1}),j=k({mutationFn:async({mode:n,order:i,printWindow:l})=>{const d=n==="priced"?(await u.admin.orders.generateExcel(i.id)).excelFile:null,h=await u.admin.orders.detail(i.id);return{excelFile:d,mode:n,order:h,orderId:i.id,printWindow:l}},onError:(n,i)=>{i==null||i.printWindow.close(),o({kind:"error",message:L(n)})},onSettled:async(n,i,l)=>{z(null),l&&await Promise.all([r.invalidateQueries({queryKey:c.admin.orders(e.viewerKey)}),r.invalidateQueries({queryKey:c.admin.orderDetail(e.viewerKey,l.order.id)})])},onSuccess:({excelFile:n,mode:i,order:l,printWindow:d})=>{Ce(d,l,(n==null?void 0:n.fileName)??"",i),o({kind:"success",message:i==="priced"?"Окно печати открыто. Заказ подготовлен в ширину одной страницы.":"Окно печати без цен открыто. Заказ подготовлен в ширину одной страницы."})},retry:!1}),_=k({mutationFn:async({mode:n,orders:i,printWindow:l})=>{const d=await Promise.all(i.map(h=>u.admin.orders.detail(h.id)));return{mode:n,orders:d,printWindow:l}},onError:(n,i)=>{i==null||i.printWindow.close(),o({kind:"error",message:L(n)})},onSettled:()=>{Y(null)},onSuccess:({mode:n,orders:i,printWindow:l})=>{Ke(l,i,n),o({kind:"success",message:n==="priced"?`Окно печати открыто. Заказов: ${i.length}.`:`Окно печати без цен открыто. Заказов: ${i.length}.`})},retry:!1}),v=k({mutationFn:async n=>{const{excelFile:i}=await u.admin.deliveryExcels.create({catalogVersionId:n});return await u.admin.deliveryExcels.download(i.id,i.fileName),i},onError:n=>{o({kind:"error",message:Pe(n)})},onSettled:async()=>{await r.invalidateQueries({queryKey:c.admin.deliveryExcels(e.viewerKey)})},onSuccess:()=>{o({kind:"success",message:"Сводка заказов подготовлена и скачана."})},retry:!1}),x=k({mutationFn:async()=>u.admin.catalogVersions.closeActive(),onError:n=>{o({kind:"error",message:Ae(n)})},onSettled:async()=>{await Promise.all([r.invalidateQueries({queryKey:c.admin.catalogVersions(e.viewerKey)}),r.invalidateQueries({queryKey:c.admin.archive(e.viewerKey)}),r.invalidateQueries({queryKey:["admin","catalog-imports"]}),r.invalidateQueries({queryKey:["admin","orders",e.viewerKey]}),r.invalidateQueries({queryKey:c.admin.catalogEditor(e.viewerKey)}),r.invalidateQueries({queryKey:c.catalog.active(e.viewerKey)}),r.invalidateQueries({queryKey:c.catalog.filters(e.viewerKey)}),r.invalidateQueries({queryKey:["catalog","active","items",e.viewerKey]}),r.invalidateQueries({queryKey:c.cart.current(e.viewerKey)})])},onSuccess:n=>{E(n.catalogVersion.id),p(null),o({kind:"success",message:`Каталог закрыт и архивирован. Очищено корзин: ${n.clearedCarts}. Освобождено резервов: ${n.releasedQuantity}.`})},retry:!1}),le=n=>{p(i=>i===n?null:n),o(null)},oe=n=>{w.isPending||j.isPending||_.isPending||(B(n.id),o(null),w.mutate(n))},J=(n,i)=>{if(w.isPending||j.isPending||_.isPending)return;const l=window.open("","_blank","width=1280,height=900");if(!l){o({kind:"error",message:"Браузер заблокировал окно печати. Разрешите всплывающие окна и повторите."});return}l.document.write("<!doctype html><title>Готовим печать</title><body>Готовим заказ к печати…</body>"),z({mode:i,orderId:n.id}),o(null),j.mutate({mode:i,order:n,printWindow:l})},X=(n,i)=>{if(n.length===0||w.isPending||j.isPending||_.isPending)return;const l=i==="plain"?"без цен и сумм":"с ценами и суммами";if(!window.confirm(`Распечатать все заказы текущего каталога ${l}? Каждый заказ будет на отдельном листе.`))return;const h=window.open("","_blank","width=1280,height=900");if(!h){o({kind:"error",message:"Браузер заблокировал окно печати. Разрешите всплывающие окна и повторите."});return}h.document.write("<!doctype html><title>Готовим печать</title><body>Готовим все заказы к печати…</body>"),Y(i),o(null),_.mutate({mode:i,orders:n,printWindow:h})},ce=()=>{!A||v.isPending||(o(null),v.mutate(A))},ue=()=>{!G||x.isPending||!window.confirm("Закрыть текущий активный каталог, архивировать его и очистить все неподтверждённые корзины?")||(o(null),x.mutate())},me=N.useMemo(()=>q?[{...q,id:"admin-orders-download"}]:[],[q]);if(S.isLoading||e.isLoading)return t.jsx(Q,{actions:null,description:"Список заказов клиентов и Excel-выгрузки.",title:"Заказы",children:t.jsx(Z,{children:"Загружаем заказы для административного режима просмотра."})});if(S.error)return t.jsx(Q,{actions:null,description:"Не удалось загрузить список заказов.",title:"Заказы",children:t.jsx(ee,{action:t.jsx("button",{onClick:()=>void S.refetch(),type:"button",children:"Повторить"}),children:S.error.message})});const m=S.data,b=(m==null?void 0:m.items)??[],he=b.reduce((n,i)=>n+i.totalQuantity,0),pe=b.reduce((n,i)=>n+M(i.totalAmount),0),ge=P?ie(P):"Каталог не выбран";return t.jsxs(Q,{actions:t.jsxs("div",{className:"admin-page-header__actions",children:[t.jsxs("span",{className:"orders-page__count",children:["Всего заказов: ",(m==null?void 0:m.totalItems)??0]}),t.jsx("button",{className:"orders-catalog-close__button",disabled:!G||x.isPending,onClick:ue,type:"button",children:x.isPending?"Закрываем…":"Закрыть текущий каталог"})]}),description:"Управление заказами, экспортами и печатью",title:"Заказы",children:[t.jsxs("section",{className:"admin-toolbar orders-toolbar","aria-label":"Фильтры и экспорт заказов",children:[t.jsxs("div",{className:"admin-toolbar__group admin-toolbar__group--filters",children:[t.jsxs("label",{className:"admin-toolbar__field",children:[t.jsx("span",{children:"Поставка"}),t.jsx("select",{"aria-label":"Каталог для выгрузки заказов",disabled:H.isLoading||v.isPending||x.isPending,onChange:n=>E(n.target.value),value:A,children:f.length===0?t.jsx("option",{value:"",children:"Каталог не выбран"}):f.map(n=>t.jsx("option",{value:n.id,children:ie(n)},n.id))})]}),t.jsxs("div",{className:"admin-toolbar__field admin-toolbar__field--readonly",children:[t.jsx("span",{children:"Текущий срез"}),t.jsx("strong",{children:ge})]})]}),t.jsxs("div",{className:"admin-toolbar__group admin-toolbar__group--exports",children:[t.jsx("button",{className:"orders-delivery-export__button",disabled:!A||v.isPending||x.isPending,onClick:ce,type:"button",children:v.isPending?"Готовим…":"Скачать Excel"}),t.jsx("button",{className:"orders-print-all__button",disabled:!b.length||w.isPending||v.isPending||j.isPending||_.isPending||x.isPending,onClick:()=>X(b,"priced"),type:"button",children:U==="priced"?"Печатаем…":"Печать"}),t.jsx("button",{className:"orders-print-all__button orders-print-all__button--plain",disabled:!b.length||w.isPending||v.isPending||j.isPending||_.isPending||x.isPending,onClick:()=>X(b,"plain"),type:"button",children:U==="plain"?"Печатаем…":"Без цен"})]})]}),t.jsxs("section",{className:"orders-page__stats","aria-label":"Сводка заказов",children:[t.jsxs("span",{children:[t.jsx("small",{children:"Заказов"}),t.jsx("strong",{children:Se((m==null?void 0:m.totalItems)??0)})]}),t.jsxs("span",{children:[t.jsx("small",{children:"Товаров"}),t.jsx("strong",{children:T(he)})]}),t.jsxs("span",{children:[t.jsx("small",{children:"Сумма"}),t.jsx("strong",{children:D(pe)})]})]}),!m||b.length===0?t.jsx("section",{className:"orders-content-area orders-content-area--empty",children:t.jsx(te,{children:"Заказы ещё не появились. После оформления заказов они появятся здесь."})}):t.jsx("div",{className:"orders-page orders-content-area stack",children:t.jsx("div",{className:"admin-orders-list",children:b.map(n=>{const i=a===n.id,l=w.isPending||j.isPending||_.isPending,d=i?$.data:null,h=(d==null?void 0:d.totalQuantity)??(d==null?void 0:d.items.reduce((y,xe)=>y+xe.qty,0))??n.totalQuantity;return t.jsxs("article",{className:`admin-order-row${i?" admin-order-row--expanded":""}`,children:[t.jsxs("div",{className:"admin-order-row__line",children:[t.jsxs("button",{"aria-expanded":i,className:"admin-order-row__open",onClick:()=>le(n.id),type:"button",children:[t.jsxs("span",{className:"admin-order-row__cell",children:[t.jsx("span",{className:"admin-order-row__label",children:"Заказ"}),t.jsxs("strong",{children:["№",n.orderNumber]})]}),t.jsxs("span",{className:"admin-order-row__cell",children:[t.jsx("span",{className:"admin-order-row__label",children:"Клиент"}),t.jsx("strong",{children:n.client.name})]}),t.jsxs("span",{className:"admin-order-row__cell",children:[t.jsx("span",{className:"admin-order-row__label",children:"Дата"}),t.jsx("strong",{children:K(n.confirmedAt??n.createdAt)})]}),t.jsxs("span",{className:"admin-order-row__cell",children:[t.jsx("span",{className:"admin-order-row__label",children:"Статус"}),t.jsx(ne,{status:n.status})]}),t.jsxs("span",{className:"admin-order-row__cell admin-order-row__cell--numeric",children:[t.jsx("span",{className:"admin-order-row__label",children:"Заказано"}),t.jsx("strong",{children:$e(n)})]}),t.jsxs("span",{className:"admin-order-row__cell admin-order-row__cell--numeric",children:[t.jsx("span",{className:"admin-order-row__label",children:"Сумма"}),t.jsx("strong",{children:D(n.totalAmount)})]})]}),t.jsxs("div",{className:"admin-order-row__actions",children:[t.jsx("button",{className:"admin-order-row__excel",disabled:l,onClick:()=>oe(n),type:"button",children:C===n.id?"Скачиваем…":"Excel"}),t.jsx("button",{className:"admin-order-row__print",disabled:l,onClick:()=>J(n,"priced"),type:"button",children:(g==null?void 0:g.orderId)===n.id&&g.mode==="priced"?"Печатаем…":"Печать"}),t.jsx("button",{className:"admin-order-row__print admin-order-row__print--plain",disabled:l,onClick:()=>J(n,"plain"),type:"button",children:(g==null?void 0:g.orderId)===n.id&&g.mode==="plain"?"Печатаем…":"Без цен"})]})]}),i?t.jsx("div",{className:"admin-order-row__details",children:$.isLoading?t.jsx(Z,{children:"Загружаем детали заказа."}):$.error?t.jsx(ee,{action:t.jsx("button",{onClick:()=>void $.refetch(),type:"button",children:"Повторить"}),children:$.error.message}):d?t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:"admin-order-details-summary",children:[t.jsxs("div",{className:"admin-order-details-summary__title",children:[t.jsxs("strong",{children:["Заказ №",d.orderNumber]}),t.jsx(ne,{status:d.status})]}),t.jsxs("div",{className:"admin-card__meta",children:[t.jsxs("span",{children:["Клиент: ",d.client.name]}),t.jsxs("span",{children:["Статус клиента: ",Ne(d.client.status)]}),t.jsxs("span",{children:["Создан: ",K(d.createdAt)]}),t.jsxs("span",{children:["Подтверждён: ",K(d.confirmedAt)]}),t.jsxs("span",{children:["Поставка: ",R(d.deliveryDate)]}),t.jsxs("span",{children:["Заказано: ",T(h)]}),t.jsxs("span",{children:["Позиций: ",d.totalItems]}),t.jsxs("span",{children:["Итого: ",D(d.totalAmount)]}),d.editedByAdmin?t.jsx("span",{className:"admin-chip admin-chip--warn",children:"Редактировался администратором"}):null]})]}),t.jsx("div",{className:"admin-order-items-table",children:d.items.map(y=>t.jsxs("div",{className:"admin-order-items-table__row",children:[t.jsx("span",{className:"admin-order-items-table__name",children:y.name}),t.jsx("span",{children:y.category}),t.jsxs("span",{children:[y.qty," шт."]}),t.jsx("span",{children:D(y.finalPrice)}),t.jsx("strong",{children:D(y.lineTotal)})]},y.id))}),t.jsxs("div",{className:"admin-order-row__detail-actions",children:[t.jsx(we,{className:"orders-back-link",to:`/admin/orders/${n.id}`,children:"Открыть карточку заказа"}),d.excelFiles.length>0?t.jsxs("span",{className:"admin-muted",children:["Excel: ",d.excelFiles[0].fileName]}):t.jsx("span",{className:"admin-muted",children:"Excel будет подготовлен по кнопке в строке заказа."})]})]}):t.jsx(te,{children:"Нет данных для выбранного заказа."})}):null]},n.id)})})}),t.jsx(fe,{notices:me,onDismiss:()=>o(null)})]})}export{Me as default};
