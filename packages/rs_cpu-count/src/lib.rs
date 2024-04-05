use neon::prelude::*;

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

fn get_num_cpus(mut cx: FunctionContext) -> JsResult<JsNumber> {
    Ok(cx.number(num_cpus::get() as f64))
}

fn property_access(mut cx: FunctionContext) -> JsResult<JsValue> {
    let obj = cx.argument::<JsObject>(0)?;
    let key = cx.argument::<JsString>(1)?;


    let value: Handle<JsValue> = obj.get(&mut cx, key)?;
    Ok(value)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hello", hello)?;
    cx.export_function("get", get_num_cpus)?;
    cx.export_function("propertyAccess", property_access)?;

    Ok(())
}
