const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

let project_1 = 'apitest'
let randomIssueId

suite('Functional Tests', function () {
    suite('Routing Tests', function () {
        suite('POST request Tests', function () {
            test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .post(`/api/issues/${project_1}`)
                    .set('content-type', 'application/json')
                    .send({
                        issue_title: 'Issue',
                        issue_text: 'Functional Test',
                        created_by: 'freeeCodeee',
                        assigned_to: 'Jerry',
                        status_text: 'Not Yet Done',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.issue_title, 'Issue')
                        assert.equal(res.body.issue_text, 'Functional Test')
                        assert.equal(res.body.created_by, 'freeeCodeee')
                        assert.equal(res.body.assigned_to, 'Jerry')
                        assert.equal(res.body.status_text, 'Not Yet Done')
                        done()
                    })
            })
            test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .post(`/api/issues/${project_1}`)
                    .set('content-type', 'application/json')
                    .send({
                        issue_title: 'Issue',
                        issue_text: 'Functional Test',
                        created_by: 'freeeCodeee',
                        assigned_to: '',
                        status_text: '',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.issue_title, 'Issue')
                        assert.equal(res.body.issue_text, 'Functional Test')
                        assert.equal(res.body.created_by, 'freeeCodeee')
                        assert.equal(res.body.assigned_to, '')
                        assert.equal(res.body.status_text, '')
                        done()
                    })
            })
            test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .post(`/api/issues/${project_1}`)
                    .set('content-type', 'application/json')
                    .send({
                        issue_title: '',
                        issue_text: '',
                        created_by: 'freeeCodeee',
                        assigned_to: '',
                        status_text: '',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.error, 'required field(s) missing')
                        done()
                    })
            })
        })
        suite('GET request Tests', function () {
            test('View issues on a project: GET request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .get(`/api/issues/${project_1}`)
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.isAbove(res.body.length, 0, `project is missing issues ??`)
                        randomIssueId = res.body[0]._id
                        done()
                    })
            })
            test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .get(`/api/issues/${project_1}`)
                    .query({ _id: randomIssueId })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body[0]._id, randomIssueId)
                        done()
                    })
            })
            test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .get(`/api/issues/${project_1}`)
                    .query({ issue_title: 'Issue', created_by: 'freeeCodeee' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.isAbove(res.body.length, 0, `project is missing issues ??`)
                        let issues = res.body
                        issues.forEach((element) => {
                            assert.equal(element.issue_title, 'Issue')
                            assert.equal(element.created_by, 'freeeCodeee')
                        })
                        done()
                    })
            })
        })
        suite('PUT request Tests', function () {
            test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .put(`/api/issues/${project_1}`)
                    .send({ _id: randomIssueId, issue_title: 'different issue title' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.result, 'successfully updated')
                        assert.equal(res.body._id, randomIssueId)
                        done()
                    })
            })
            test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .put(`/api/issues/${project_1}`)
                    .send({
                        _id: randomIssueId,
                        issue_title: 'new issue title',
                        issue_text: 'new random issue text',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.result, 'successfully updated')
                        assert.equal(res.body._id, randomIssueId)
                        done()
                    })
            })
            test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .put(`/api/issues/${project_1}`)
                    .send({
                        issue_title: 'updated title',
                        issue_text: 'updated text',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.error, 'missing _id')
                        done()
                    })
            })
            test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .put(`/api/issues/${project_1}`)
                    .send({
                        _id: randomIssueId,
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.error, 'no update field(s) sent')
                        assert.equal(res.body._id, randomIssueId)
                        done()
                    })
            })
            test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .put(`/api/issues/${project_1}`)
                    .send({
                        _id: 'INVALID_ID_9000',
                        issue_text: 'updated text',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.error, 'could not update')
                        done()
                    })
            })
        })
        suite('DELETE request Tests', function () {
            test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .delete(`/api/issues/${project_1}`)
                    .send({
                        _id: randomIssueId,
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.result, 'successfully deleted')
                        done()
                    })
            })
            test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .delete(`/api/issues/${project_1}`)
                    .send({
                        _id: 'INVALID_ID_9000',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.error, 'could not delete')
                        done()
                    })
            })
            test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
                chai
                    .request(server)
                    .delete(`/api/issues/${project_1}`)
                    .send({})
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.body.error, 'missing _id')
                        done()
                    })
            })
        })
    })
})
