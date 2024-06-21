/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
define(["N/record", "N/search"], function (record, search) {

    function onRequest(context) {
        try {
            var result = '';
            if (context.request.method == "POST") {

                var body = JSON.parse(context.request.body);

                switch (body.action) {
                    case "search":
                        log.debug("body.action is ===>", "search")
                        var errors = doValidation(body, ["type", "filters", "columns"]);

                        if (errors.length > 0) {
                            return errorResponse(context, errors);
                        }
                        result = getSearch(body.type, body.filters, body.columns);
                        log.debug("Result in search ===>", result)
                        break;

                    case "search_paged":
                        var errors = doValidation(body, ["type", "filters", "columns", "pageSize", "pageIndex"]);
                        if (errors.length > 0) {
                            return errorResponse(context, errors);
                        }
                        result = getSearchPaged(body.type, body.filters, body.columns, body.pageSize, body.pageIndex);
                        break;

                    case "update_record":
                        log.debug("body.action is ===>", "update_record")
                        var errors = doValidation(body, ["type", "id", "fields"]);
                        if (errors.length > 0) {
                            return errorResponse(context, errors)
                        }
                        result = updateRecord(body.type, body.id, body.fields);
                        log.debug("resutl in update_record ==>", result)
                        break;

                    case "create_record":
                        log.debug("body.action is ===>", "create_record")
                        var errors = doValidation(body, ["type", "id", "fields"]);
                        if (errors.length > 0) {
                            return errorResponse(context, errors)
                        }
                        result = createRecord(body.type, body.fields);
                        log.debug("result in create_record ==>", result)
                        break;

                    case "lookup":
                        log.debug("body.action is ===>", "lookup")
                        var errors = doValidation(body, ["type", "id", "columns"]);
                        if (errors.length > 0) {
                            return errorResponse(context, errors)
                        }
                        result = lookup(body.type, body.id, body.columns);
                        log.debug("result in lookup ==>", result)
                        break;

                    case "load":
                        log.debug("body.action is ===>", "load")
                        var errors = doValidation(body, ["type", "id", "fields"]);
                        if (errors.length > 0) {
                            return errorResponse(context, errors)
                        }
                        result = loadRecord(body.type, body.id, body.fields)
                        log.debug("result in load", result)
                        break;

                    default:
                        return "invalid action ===>" + body.action
                }
            }

            context.response.setHeader({ name: "Access-Control-Allow-Origin", value: "*" });
            context.response.setHeader({ name: "Access-Control-Allow-Credentials", value: "true" });
            context.response.setHeader({ name: "Access-Control-Allow-Methods", value: "GET,HEAD,OPTIONS,POST,PUT" });
            context.response.setHeader({ name: "Access-Control-Allow-Headers", value: "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers" });
            context.response.setHeader({
                name: "Content-Type",
                value: "application/json"
            })


            context.response.write(JSON.stringify(result));

        } catch (error) {
            return errorResponse(context, error)
        }
    }

    function errorResponse(context, result) {
        var resp = {
            success: false,
            result: result
        }
        return context.response.write(JSON.stringify(resp))
    }

    function doValidation(ctx, fields) {

        var errors = [];
        for (var i = 0; i < fields.length; i++) {

            if (!ctx[fields[i]]) {
                errors.push('Parameters missing:' + fields[i] + " got " + ctx[fields[i]])
            }

        }

        return errors;

    }

    function getSearchPaged(type, filters, columns, pagesize, pageIndex) {
        try {
            var dynamic_search = search.create({
                type: type,
                filters: filters,
                columns: columns
            });
            var result_out = [];
            var myPagedData = dynamic_search.runPaged({ pageSize: pagesize });

            var count = myPagedData.count;

            var myPage = myPagedData.fetch({
                index: pageIndex
            });
            myPage.data.forEach(function (res) {
                var values = {};
                //iterate over the collection of columns for the value
                columns.forEach(function (c, i, a) {

                    var key_name = "";

                    if (c.join)
                        key_name = c.join + "_" + c.name
                    else
                        key_name = c.name;

                    var value = res.getText(c);

                    if (value == null) {
                        values[key_name] = res.getValue({
                            name: c
                        });
                    } else {

                        values[key_name] = res.getValue({
                            name: c
                        });

                        values[key_name + "_txt"] = res.getText({
                            name: c
                        });
                    }
                });
                result_out.push(values);
            });

            return {
                count: count, data: result_out
            };
        }

        catch (e) {
            log.error("getSearch failed due to an exception", e);
            throw e;
        }
    }

    function getSearch(type, filters, columns) {
        try {
            var dynamic_search
            if (typeof type === 'string' || type instanceof String) {
                dynamic_search = search.create({
                    type: type,
                    filters: filters,
                    columns: columns
                });

            } else {
                dynamic_search = type
                columns = JSON.parse(JSON.stringify(dynamic_search)).columns
            }

            var result_out = [];
            var myPagedData = dynamic_search.runPaged({ pageSize: 1000 });
            myPagedData.pageRanges.forEach(function (pageRange) {
                var myPage = myPagedData.fetch({
                    index: pageRange.index
                });
                myPage.data.forEach(function (res) {
                    var values = {
                        id: res.id

                    };
                    //iterate over the collection of columns for the value
                    columns.forEach(function (c, i, a) {

                        var key_name = "";

                        if (c.join)
                            key_name = c.join + "_" + c.name
                        else if (c.name.indexOf("formula") > -1)
                            key_name = c.name + "_" + i
                        else
                            key_name = c.name;

                        var value = res.getText(c);

                        if (value == null) {
                            values[key_name] = res.getValue(c);
                        } else {

                            values[key_name] = res.getValue(c);

                            values[key_name + "_txt"] = res.getText(c);
                        }
                    });
                    result_out.push(values);
                });
            });
            return result_out;
        }
        catch (e) {
            log.error("getSearch failed due to an exception", e);
            throw e;
        }
    }

    function loadRecord(type, id, fields) {
        try {

            var currentRecod = record.load({
                type: type,
                id: id
            });
            var result = {};

            if (Array.isArray(fields)) {
                fields.map(function (c, i) {
                    result[c] = currentRecod.getValue(c);
                    result[c + "_txt"] = currentRecod.getText(c);
                })
            }


            return result;


        } catch (error) {
            log.error("Error in loadRecord", error)
            throw error;
        }
    }

    function lookup(type, id, fields) {
        try {
            return search.lookupFields({
                type: type,
                id: id,
                columns: fields
            });
        } catch (error) {
            log.error("Error in lookup", error)
            throw error;
        }
    }

    function createRecord(type, fields) {
        try {

            var currentRecord = record.create.promise({
                type: type,
                isDynamic: true
            });

            currentRecord.then(function (field) {
                field.setValue({
                    fieldId: fields,
                    value: ''
                });
                return field.save();
            }, (e) => {
                log.error({
                    title: 'Unable to create record',
                    details: e.name
                });
                throw e;
            });
        } catch (error) {
            log.error("Error in createRecord", error);
            throw error;
        }
    }

    function updateRecord(type, id, fields) {
        try {

            log.debug("fields ==>", fields);

            if (typeof fields == "object") {
                var res = {};
                for (const key in fields) {
                    res[key] = fields[key];
                }
            }

            log.debug("res =>", res)


            return record.submitFields({
                type: type,
                id: id,
                values: fields
            })
        } catch (error) {
            log.error("Error in upateRecord", error);
            throw error;
        }
    }

    return {
        onRequest: onRequest
    }
});



